import { NextResponse } from "next/server";
import { z, ZodType } from "zod";

export type ApiResponse<Res> =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "success";
      data: Res;
    };

export const executeApi =
  <Res, Req extends ZodType>(
    schema: Req,
    handler: (req: Request, body: z.infer<Req>) => Promise<Res>
  ) =>
  async (req: Request) => {
    try {
      const payload = await req.json();
      console.log(payload)
      // const parsed = schema.parse(payload);
      // console.log(parsed)
      const data = await handler(req, payload);
      console.log(data)
      return NextResponse.json({
        type: "success",
        data: data,
      });
    } catch (err) {
      console.log('hereherehere')
      return NextResponse.json(
        { type: "error", message: (err as Error).message },
        {
          status: 500,
        }
      );
    }
  };
