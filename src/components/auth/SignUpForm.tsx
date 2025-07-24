"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import encryptStr from "@/utils/encryptStr"; // 导入加密函数
import request from "@/utils/request"; // 导入封装的request
import { useRouter } from "next/navigation"; // 用于跳转页面

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // 错误信息
  const router = useRouter(); // 获取router对象

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 校验：如果用户名或密码为空，显示错误
    if (!username || !password) {
      setError('Username and password cannot be empty!');
      return;
    }

    // 清除之前的错误信息
    setError(null);

    // 使用加密方法对用户名和密码进行加密
    const encryptedUsername = encryptStr(username);
    const encryptedPassword = encryptStr(password);

    const payload = {
      Password: encryptedPassword,
      UUID: "", // 可以根据需要传递 UUID
      UserName: encryptedUsername,
      VerificationCode: "", // 如果有验证码字段，也可以传递
    };

    try {
      // 使用封装的request函数进行登录请求
      const response = await request({
        url: "/Hr_Employee/login",
        method: "POST",
        data: payload,
      });

      // 判断返回的状态
      if (response.Status === false) {
        // 如果是错误信息，显示错误消息
        setError(response.Message);
      } else if (response.Status === true) {
        // 如果成功，跳转到首页
        const userInfo = res.Data;

        // 缓存 token 和用户信息
        if (typeof window !== "undefined") {
          localStorage.setItem("token", userInfo?.Token || "");
          localStorage.setItem("userInfo", JSON.stringify(userInfo || {}));
        }
        router.push("/"); // 跳转到首页
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!error} // 如果有错误，标记为错误状态
                    hint={error && !username ? "Username cannot be empty" : undefined} // 显示提示信息
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!error} // 如果有错误，标记为错误状态
                      hint={error && !password ? "Password cannot be empty" : undefined} // 显示提示信息
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm">
                    {error} {/* 显示错误信息 */}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
