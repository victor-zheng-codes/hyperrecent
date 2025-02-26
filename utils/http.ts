import { NextResponse } from "next/server";

export function response(status: number, body: any) {
  return new NextResponse(JSON.stringify(body), {
    status,
  });
}
