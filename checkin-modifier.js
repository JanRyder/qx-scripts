/**
 * 签到坐标随机化脚本 - QuantumultX
 * 适用于自动签到系统的坐标随机化
 */

const CONFIG = {
    // 基础坐标 (广东省江门市台山市环北大道80号)
    BASE_LON: 112.79295,
    BASE_LAT: 22.25294,
    
    // 随机范围 (米)
    MIN_RADIUS: 50.0,
    MAX_RADIUS: 100.0,
    
    // 目标地址
    ADDRESS: "广东省江门市台山市环北大道80号"
};

/**
 * 生成随机坐标偏移
 */
function generateRandomOffset() {
    // 随机距离和角度
    const distance = Math.random() * (CONFIG.MAX_RADIUS - CONFIG.MIN_RADIUS) + CONFIG.MIN_RADIUS;
    const angle = Math.random() * 2 * Math.PI;
    
    // 地球半径 (米)
    const earthRadius = 6371000;
    
    // 计算偏移量 (转换为度)
    const latOffset = (distance * Math.cos(angle)) / earthRadius * (180 / Math.PI);
    const lonOffset = (distance * Math.sin(angle)) / 
        (earthRadius * Math.cos(CONFIG.BASE_LAT * Math.PI / 180)) * (180 / Math.PI);
    
    const newLat = CONFIG.BASE_LAT + latOffset;
    const newLon = CONFIG.BASE_LON + lonOffset;
    
    return {
        lon: parseFloat(newLon.toFixed(6)),
        lat: parseFloat(newLat.toFixed(6))
    };
}

/**
 * 主要的请求修改函数
 */
let body = $request.body;

if (!body) {
    console.log("[签到修改] 请求体为空");
    $done({});
} else {
    try {
        let requestData = JSON.parse(body);
        console.log("[签到修改] 原始请求:", JSON.stringify(requestData));
        
        // 生成新的随机坐标
        const newCoords = generateRandomOffset();
        
        // 修改坐标参数 (对应Python代码中的x, y)
        if (requestData.x !== undefined) {
            requestData.x = newCoords.lon;
        }
        if (requestData.y !== undefined) {
            requestData.y = newCoords.lat;
        }
        
        // 确保地址正确
        if (requestData.address !== undefined) {
            requestData.address = CONFIG.ADDRESS;
        }
        
        // 确保状态为4 (对应Python代码中的STATE)
        if (requestData.state !== undefined) {
            requestData.state = 4;
        }
        
        // 健康状态参数保持不变
        if (requestData.isHyperpyrexia === undefined) requestData.isHyperpyrexia = 0;
        if (requestData.isJointPain === undefined) requestData.isJointPain = 0;
        if (requestData.isRash === undefined) requestData.isRash = 0;
        
        console.log(`[签到修改] 新坐标: ${newCoords.lon}, ${newCoords.lat}`);
        console.log("[签到修改] 修改后请求:", JSON.stringify(requestData));
        
        // 保留原始请求头，只修改Content-Type
        let headers = $request.headers;
        headers["Content-Type"] = "application/json;charset=UTF-8";
        
        $done({ 
            body: JSON.stringify(requestData),
            headers: headers
        });
        
    } catch (error) {
        console.log("[签到修改] 解析请求失败:", error.toString());
        $done({});
    }
}
