import { pink } from "@material-ui/core/colors";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 방 생성 함수
export async function createRoom(request) {
  try {
    const { title, status } = await request.json();
    const createRoom = await prisma.tbl_room.create({
      data: {
        room_name: title,
        room_status: status,
      },
    });
    return NextResponse.json(
      { message: "채팅방이 생성되었습니다.", createRoom },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "채팅방 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 방 목록 조회 함수
export async function getRooms(request) {
  try {
    const roomData = await prisma.tbl_room.findMany({});
    return NextResponse.json(roomData);
  } catch (error) {
    return NextResponse.json(
      { message: "방 생성 목록을 불러오는 중 오류가 발생했습니다.", error },
      { status: 500 }
    );
  }
}
// 방 참가 클릭 함수
export async function joinRoom(request) {
  // POST 요청 처리
  const { searchParams } = new URL(request.url);
  const room_no = searchParams.get("room_no");
  const user_id = searchParams.get("user_id");
  console.log("Room No:", room_no, "User ID:", user_id);

  try {
    // 해당 방이 존재하는지 확인
    const room = await prisma.tbl_room.findUnique({
      where: {
        room_no: Number(room_no),
      },
    });

    if (!room) {
      return NextResponse.json(
        { message: "존재하지 않는 방입니다." },
        { status: 404 }
      );
    }

    // 방 참가 정보 저장
    await prisma.tbl_room_join.create({
      data: {
        room_id: Number(room_no), // room_no를 room_id로 사용
        user_id: user_id, // 여기서 user_id를 사용
      },
    });
    await prisma.tbl_message.create({
      user_id,
    });
    // 방 참가 성공 메시지 반환
    return NextResponse.json(
      { message: "방에 성공적으로 참가하였습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // 에러 로그 추가
    return NextResponse.json(
      { message: "방 참가 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
//채팅방 채팅내역 조회 함수
export async function chatRog(request) {
  //POST 요청 처리
  const { searchParams } = new URL(request.url);
  const room_no = searchParams.get("room_no");
  try {
    const chatRog = await prisma.tbl_message.findMany({
      where: {
        room_id: Number(room_no), //room_id임 이테이블은
      },
    });
    if (chatRog.message_body === "") {
      {
        return NextResponse.json({ message: "채팅내역이 없음" });
      }
    }
    return NextResponse.json(chatRog);
  } catch (error) {
    return NextResponse.json(
      { message: "채팅 내역을 불러오는 중 오류가 발생했습니다.", error },
      { status: 500 }
    );
  }
}
