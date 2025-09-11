"use client";

import { useParams } from "next/navigation";

export default function GamePage() {
  const params = useParams();

  const code = params.code as string;

  return <div>Code is {code}</div>;
}
