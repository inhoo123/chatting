"use client";
import { useState } from "react";

const CreateRoomPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    status: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 입력
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    clearMessages();
  };
  //새로 입력할때마다 에러메세지를 초기화
  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };
  const validate = async () => {
    const { title, status } = formData;
    if (!title) {
      setErrorMessage("제목을 입력하세요");
      return;
    }
    if (!status) {
      setErrorMessage("옵션을 선택하세요");
      return;
    }
    try {
      const response = await fetch("/api/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, status }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("채팅방이 성공적으로 생성되었습니다.");
      } else {
        setErrorMessage(data.message || "채팅방 생성 중 오류");
      }
    } catch (error) {
      setErrorMessage("채팅방 생성 중 오류");
    }
  };

  return (
    <div>
      <h1>Create Room Page</h1>
      <input
        id="room_name"
        name="title"
        placeholder="제목을 입력하세요"
        type="text"
        value={formData.title}
        onChange={handleChange}
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="">옵션 선택</option>
        <option value="personal">메모</option>
        <option value="public">메신저</option>
      </select>
      <button type="button" onClick={validate}>
        생성
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default CreateRoomPage;
