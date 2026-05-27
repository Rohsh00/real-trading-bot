import { Request, Response } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import axios from "axios";
import { settings, resolveWorkspacePath } from "../../core/config";
import { redisClient } from "../../core/redis";
import { RiskService } from "../../services/riskService";
import { logger } from "../../core/logger";

export class BrokerController {
  static async getStatus(req: Request, res: Response) {
    let brokerName = "unknown";
    try {
      const filePath = resolveWorkspacePath("config/broker_config.yaml");
      const fileContent = fs.readFileSync(filePath, "utf8");
      const brokerConfig = yaml.parse(fileContent);
      brokerName = brokerConfig.broker || "unknown";
    } catch (err) {}

    try {
      const riskSettings = await RiskService.getSettings();
      return res.json({
        broker: brokerName,
        mode: brokerName === "paper" ? "Paper Trading" : "Live Trading",
        is_paper: brokerName === "paper",
        risk_manager: {
          max_position_size: riskSettings.max_position_size || 10000.0,
          currency: "USD",
        },
      });
    } catch (err: any) {
      logger.error(`Error fetching broker status: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }

  static getFyersLogin(req: Request, res: Response) {
    const authUrl = `https://api-t1.fyers.in/api/v3/generate-authcode?client_id=${settings.FYERS_APP_ID}&redirect_uri=${encodeURIComponent(settings.FYERS_REDIRECT_URI)}&response_type=code&state=sample_state`;
    return res.redirect(authUrl);
  }

  static async getFyersCallback(req: Request, res: Response) {
    const code = (req.query.auth_code || req.query.code) as string;
    if (!code) {
      return res.status(400).json({ success: false, error: "No auth code received from Fyers" });
    }

    try {
      const appIdHash = crypto.createHash("sha256")
        .update(`${settings.FYERS_APP_ID}:${settings.FYERS_SECRET_KEY}`)
        .digest("hex");

      const response = await axios.post("https://api.fyers.in/api/v3/validate-authcode", {
        grant_type: "authorization_code",
        appIdHash,
        code,
      });

      if (response.data.s === "ok") {
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        // Save token to Redis
        const tokenData = { access_token: accessToken, refresh_token: refreshToken };
        await redisClient.set("fyers_access_token", JSON.stringify(tokenData));
        logger.info("Fyers token saved to Redis");

        return res.json({ success: true, message: "Fyers authenticated successfully!" });
      } else {
        return res.status(400).json({ success: false, error: response.data.message || "Token generation failed" });
      }
    } catch (err: any) {
      logger.error(`Fyers Callback Error: ${err.message}`);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
