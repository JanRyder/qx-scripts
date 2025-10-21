/**
 * 签到响应日志脚本 - QuantumultX
 * 用于监控和记录签到结果
 */

/**
 * 解析签到响应结果
 */
function interpretCheckinResponse(responseData) {
    const code = responseData.resp_code;
    const msg = (responseData.resp_msg || "").trim();
    
    if (code === 0) {
        if (msg.includes("无需签到") || msg.includes("无须考勤") || msg.includes("无须签到")) {
            return { type: "no_need", message: msg || "无需签到" };
        }
        return { type: "success", message: msg || "签到成功" };
    }
    
    return { type: "error", message: msg || "签到失败" };
}

/**
 * 主要的响应处理函数
 */
let body = $response.body;

if (!body) {
    console.log("[签到响应] 响应体为空");
    $done({});
} else {
    try {
        let responseData = JSON.parse(body);
        console.log("[签到响应] 完整响应:", JSON.stringify(responseData));
        
        // 解析签到结果 (对应Python代码中的interpret_checkin_response)
        const result = interpretCheckinResponse(responseData);
        
        switch (result.type) {
            case "success":
                console.log("✅ [签到结果] 签到成功: " + result.message);
                break;
            case "no_need":
                console.log("ℹ️ [签到结果] 无需签到: " + result.message);
                break;
            case "error":
                console.log("❌ [签到结果] 签到失败: " + result.message);
                break;
            default:
                console.log("⚠️ [签到结果] 未知状态: " + result.message);
        }
        
        // 记录详细信息
        if (responseData.datas) {
            console.log("[签到响应] 数据字段:", JSON.stringify(responseData.datas));
        }
        
        $done({ body: body });
        
    } catch (error) {
        console.log("[签到响应] 解析响应失败:", error.toString());
        console.log("[签到响应] 原始响应:", body.substring(0, 500));
        $done({ body: body });
    }
}