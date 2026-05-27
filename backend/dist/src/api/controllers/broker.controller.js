"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../core/config");
const redis_1 = require("../../core/redis");
const riskService_1 = require("../../services/riskService");
const logger_1 = require("../../core/logger");
class BrokerController {
    static async getStatus(req, res) {
        let brokerName = "unknown";
        try {
            const filePath = path_1.default.resolve(process.cwd(), "config/broker_config.yaml");
            const fileContent = fs_1.default.readFileSync(filePath, "utf8");
            const brokerConfig = yaml_1.default.parse(fileContent);
            brokerName = brokerConfig.broker || "unknown";
        }
        catch (err) { }
        try {
            const riskSettings = await riskService_1.RiskService.getSettings();
            return res.json({
                broker: brokerName,
                mode: brokerName === "paper" ? "Paper Trading" : "Live Trading",
                is_paper: brokerName === "paper",
                risk_manager: {
                    max_position_size: riskSettings.max_position_size || 10000.0,
                    currency: "USD",
                },
            });
        }
        catch (err) {
            logger_1.logger.error(`Error fetching broker status: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }
    }
    static getFyersLogin(req, res) {
        const authUrl = `https://api-t1.fyers.in/api/v3/generate-authcode?client_id=${config_1.settings.FYERS_APP_ID}&redirect_uri=${encodeURIComponent(config_1.settings.FYERS_REDIRECT_URI)}&response_type=code&state=sample_state`;
        return res.redirect(authUrl);
    }
    static async getFyersCallback(req, res) {
        const code = (req.query.auth_code || req.query.code);
        if (!code) {
            return res.status(400).json({ success: false, error: "No auth code received from Fyers" });
        }
        try {
            const appIdHash = crypto_1.default.createHash("sha256")
                .update(`${config_1.settings.FYERS_APP_ID}:${config_1.settings.FYERS_SECRET_KEY}`)
                .digest("hex");
            const response = await axios_1.default.post("https://api.fyers.in/api/v3/validate-authcode", {
                grant_type: "authorization_code",
                appIdHash,
                code,
            });
            if (response.data.s === "ok") {
                const accessToken = response.data.access_token;
                const refreshToken = response.data.refresh_token;
                // Save token to Redis
                const tokenData = { access_token: accessToken, refresh_token: refreshToken };
                await redis_1.redisClient.set("fyers_access_token", JSON.stringify(tokenData));
                logger_1.logger.info("Fyers token saved to Redis");
                return res.json({ success: true, message: "Fyers authenticated successfully!" });
            }
            else {
                return res.status(400).json({ success: false, error: response.data.message || "Token generation failed" });
            }
        }
        catch (err) {
            logger_1.logger.error(`Fyers Callback Error: ${err.message}`);
            return res.status(500).json({ success: false, error: err.message });
        }
    }
}
exports.BrokerController = BrokerController;
