"use client";

import React, { useEffect, useState } from "react";

const SNSConnectionPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Facebook SDK 초기화
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1250093362971604", // 테스트용 임시 App ID (실제로는 Facebook 개발자 콘솔에서 받은 ID 사용)
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
    };

    // Facebook SDK 스크립트 동적 로드
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/ko_KR/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    setIsLoading(true);

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          const userId = response.authResponse.userID;

          console.log("Login successful!");
          console.log("Access Token:", token);
          console.log("User ID:", userId);

          setAccessToken(token);

          // 사용자 기본 정보 가져오기 (선택사항)
          window.FB.api(
            "/me",
            { fields: "name,email" },
            function (userResponse) {
              console.log("User Info:", userResponse);
              setUserInfo(userResponse);
              setIsLoading(false);
            }
          );
        } else {
          console.log("User cancelled login or did not fully authorize.");
          setIsLoading(false);
        }
      },
      {
        scope: "email,pages_read_engagement,pages_show_list", // 필요한 권한 설정
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SNS 연동</h1>
          <p className="text-gray-600">Facebook API Access Token 받기</p>
        </div>

        {/* Access Token이 없을 때 로그인 버튼 */}
        {!accessToken && (
          <div className="space-y-4">
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-4 h-4 mr-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span className="text-white font-medium text-sm">
                {isLoading ? "로그인 중..." : "Facebook 로그인"}
              </span>
            </button>
          </div>
        )}

        {/* Access Token이 있을 때 결과 표시 */}
        {accessToken && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">
                ✅ 로그인 성공!
              </h3>
              {userInfo && (
                <div className="text-green-700 mb-3">
                  <p>
                    <strong>이름:</strong> {userInfo.name}
                  </p>
                  {userInfo.email && (
                    <p>
                      <strong>이메일:</strong> {userInfo.email}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-gray-800 font-semibold mb-2">
                🔑 Access Token
              </h3>
              <div className="bg-white border rounded p-3 text-sm font-mono break-all text-gray-700">
                {accessToken}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(accessToken)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                📋 복사
              </button>
            </div>

            <button
              onClick={() => {
                setAccessToken(null);
                setUserInfo(null);
              }}
              className="w-full px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium text-sm transition-colors"
            >
              다시 로그인
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            이 토큰을 사용해서 Facebook API를 호출할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SNSConnectionPage;
