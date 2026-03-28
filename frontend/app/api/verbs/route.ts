export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${process.env.BACKEND_URL}/verbs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return new Response("Failed to fetch verbs", { status: 500 });
  }

  const data = await res.json();

  return Response.json(data);
}
