"use client"
import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    phone: "",
    address: "",
    detailAddress: "",
    birth: { year: "", month: "", day: "" },
  });

  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBirthChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      birth: { ...prev.birth, [key]: value },
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#F0F5EC] to-[#FCFBF8] flex justify-center py-16 px-4">
      <main className="max-w-[600px] w-full bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl text-[#594A3E] mb-4">회원가입</h1>
          <p className="text-sm text-gray-600">펫풀 커뮤니티에 가입하여 반려동물의 영향력을 키워보세요</p>
        </div>

        <form className="space-y-6">
          {[
            { label: "이메일", type: "email", key: "email", button: "인증번호 발송" },
            { label: "인증번호", type: "text", key: "code", button: "인증번호 확인" },
          ].map(({ label, type, key, button }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#594A3E] mb-2">{label}</label>
              <div className="flex flex-col md:flex-row gap-2">
                <input type={type} className="flex-1 h-12 px-4 border border-gray-300 rounded-md text-sm" placeholder={`${label}를 입력하세요`} value={form[key]} onChange={e => handleChange(key, e.target.value)} />
                <button type="button" className="h-12 px-4 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">{button}</button>
              </div>
            </div>
          ))}

          {[
            { label: "비밀번호", type: "password", key: "password" },
            { label: "비밀번호 확인", type: "password", key: "confirmPassword" },
            { label: "이름", type: "text", key: "name" },
            { label: "닉네임", type: "text", key: "nickname" },
            { label: "전화번호", type: "tel", key: "phone" },
            { label: "주소", type: "text", key: "address" },
            { label: "상세주소", type: "text", key: "detailAddress" },
          ].map(({ label, type, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#594A3E] mb-2">{label}</label>
              <input type={type} className="w-full h-12 px-4 border border-gray-300 rounded-md text-sm" placeholder={`${label}를 입력하세요`} value={form[key]} onChange={e => handleChange(key, e.target.value)} />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-[#594A3E] mb-2">생년월일</label>
            <div className="flex flex-col md:flex-row gap-2">
              {["년", "월", "일"].map((placeholder, index) => (
                <input
                  key={placeholder}
                  type="text"
                  placeholder={placeholder}
                  className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm"
                  value={Object.values(form.birth)[index]}
                  onChange={e => handleBirthChange(Object.keys(form.birth)[index], e.target.value)}
                />
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-black mt-4">
            이미 계정이 있으신가요? <a href="#" className="text-yellow-500 font-medium hover:underline">로그인</a>
          </div>

          <button type="submit" className="w-full h-14 bg-yellow-500 text-white font-medium text-base rounded-md mt-4 hover:bg-yellow-600">확인</button>
        </form>
      </main>
    </div>
  );
}