"use client";

import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import request from "@/utils/request";
import { ApiResponse } from "@/types/api";
import Image from "next/image";

interface CaptureParams {
  UserID: string | number;
  imgBase64?: string | null;
  UserName?: string | null;

  [key: string]: unknown;  // 允许任意字符串键
}

const CameraUploader: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const userInfo =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userInfo") || "{}")
      : {};

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("无法访问摄像头，请检查权限或使用 HTTPS 协议打开页面");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  };

  const takePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await handleImageBlob(blob);
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageBlob(file);
    }
  };


  function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  }

  const handleImageBlob = async (file: Blob) => {
    try {
      // 压缩图片
      const fileObj = blobToFile(file /*Blob*/, 'image.jpg');
      const compressed = await imageCompression(fileObj, {
        maxWidthOrHeight: 900,
        maxSizeMB: 1,
        useWebWorker: true,
        initialQuality: 0.8,
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(",")[1];
        setBase64Image(base64String);

        console.log("上传图片：", base64String);

        // 调用接口
        await matchPerson(base64String);
      };
      reader.readAsDataURL(compressed);
    } catch (error) {
      console.error("图片处理失败:", error);
    }
  };

  const matchPerson = async (imgBase64?: string | null, needPhoto: boolean = true) => {
    const params: CaptureParams = {
      "UserID": userInfo.id,
    }
    if (needPhoto) {
      params['imgBase64'] = imgBase64;
    } else {
      params['UserName'] = userInfo.userName;
    }
    try {
      const response: ApiResponse = await request({
        url: "/Clock/MatchPerson",
        method: "POST",
        data: params,
      });
      console.log("匹配结果：", response);
      if (response?.Status) {
        alert("打卡成功");
      } else {
        alert(`失败：${response?.Message || "未知错误"}`);
      }
    } catch (error) {
      alert("请求失败，请检查网络或稍后重试");
      console.error("请求异常", error);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">拍照或上传图片</h2>

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={startCamera}
        >
          拍照
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => fileInputRef.current?.click()}
        >
          上传照片
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {showCamera && (
        <div className="space-y-2">
          <video ref={videoRef} autoPlay className="w-full max-w-md border rounded" />
          <button
            onClick={takePhoto}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            拍照并处理
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {base64Image && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">预览：</h4>
          <Image
            src={`data:image/jpeg;base64,${base64Image}`}
            alt="预览图"
            className="w-full max-w-sm border rounded"
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  );
};

export default CameraUploader;
