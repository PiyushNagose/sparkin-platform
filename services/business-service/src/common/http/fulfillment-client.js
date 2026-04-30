import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";

export const fulfillmentClient = {
  async createProjectFromAcceptedQuote({ lead, quote, authorization }) {
    const response = await fetch(`${env.fulfillmentServiceUrl}/projects/from-accepted-quote`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization,
      },
      body: JSON.stringify({ lead, quote }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new AppError(
        502,
        "Vendor was selected, but project creation failed. Please retry confirmation.",
        data,
      );
    }

    return data.project;
  },
};
