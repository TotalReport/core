import { contract } from "@total-report/core-contract/contract";
import { generateOpenApi } from "@ts-rest/open-api";
import { Request, Response } from "express";

export const openapiSchema = (_req: Request, res: Response) => {
  res.send(
    generateOpenApi(contract, {
      info: {
        title: "Total report API",
        version: "1.0.0",
      },
    })
  );
};
