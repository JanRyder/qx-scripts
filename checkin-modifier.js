/**
 * 签到坐标随机化脚本
 */
const CONFIG = {
    BASE_LON: 112.79295,
    BASE_LAT: 22.25294,
    MIN_RADIUS: 50.0,
    MAX_RADIUS: 100.0,
    ADDRESS: "广东省江门市台山市环北大道80号"
};

function generateRandomOffset() {
    const distance = Math.random() * (CONFIG.MAX_RADIUS - CONFIG.MIN_RADIUS) + CONFIG.MIN_RADIUS;
    const angle = Math.random() * 2 * Math.PI;
    const earthRadius = 6371000;
    
    const latOffset = (distance * Math.cos(angle)) / earthRadius * (180 / Math.PI);
    const lonOffset = (distance * Math.sin(angle)) / 
        (earthRadius * Math.cos(CONFIG.BASE_LAT * Math.PI / 180)) * (180 / Math.PI);
    
    return {
        lon: parseFloat((CONFIG.BASE_LON + lonOffset).toFixed(6)),
        lat: parseFloat((CONFIG.BASE_LAT + latOffset).toFixed(6))
    };
}

let body = $request.body;
if (body) {
    try {
        let data = JSON.parse(body);
        const coords = generateRandomOffset();
        
        if (data.x !== undefined) data.x = coords.lon;
        if (data.y !== undefined) data.y = coords.lat;
        if (data.address !== undefined) data.address = CONFIG.ADDRESS;
        if (data.state !== undefined) data.state = 4;
        
        console.log(`[签到修改] 新坐标: ${coords.lon}, ${coords.lat}`);
        
        $done({ 
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json;charset=UTF-8" }
        });
    } catch (e) {
        console.log("[签到修改] 失败: " + e);
        $done({});
    }
} else {
    $done({});
}