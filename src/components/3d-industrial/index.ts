/**
 * 3D 空间与工业仿真组件库
 * 
 * 包含工业制造、机械仿真、3D 可视化等高级动画组件
 * 
 * 特点：
 * - 真实物理仿真
 * - 工业级精度
 * - 3D 空间表现
 * - 动画逼真流畅
 */

// 机械与制造
export { IndGearMechanism } from "./IndGearMechanism";
export type { IndGearMechanismProps, Gear } from "./IndGearMechanism";

export { IndEngineExplode } from "./IndEngineExplode";
export type { IndEngineExplodeProps, EnginePart } from "./IndEngineExplode";

export { IndRobotArm } from "./IndRobotArm";
export type { IndRobotArmProps, RobotJoint } from "./IndRobotArm";

export { IndAssemblyLine } from "./IndAssemblyLine";
export type { IndAssemblyLineProps, Product } from "./IndAssemblyLine";

// 传感与扫描
export { IndLidarScan } from "./IndLidarScan";
export type { IndLidarScanProps, LidarPoint } from "./IndLidarScan";

// 3D 可视化
export { Ind3DGlobe } from "./Ind3DGlobe";
export type { Ind3DGlobeProps, Connection } from "./Ind3DGlobe";

export { IndSolarSystem } from "./IndSolarSystem";
export type { IndSolarSystemProps, Planet } from "./IndSolarSystem";

// 流体与空气动力学
export { IndWindTunnel } from "./IndWindTunnel";
export type { IndWindTunnelProps, Particle } from "./IndWindTunnel";

// 电子与电路
export { IndCircuitBoard } from "./IndCircuitBoard";
export type { IndCircuitBoardProps, Component, Signal } from "./IndCircuitBoard";

// 智能系统
export { IndDroneSwarm } from "./IndDroneSwarm";
export type { IndDroneSwarmProps } from "./IndDroneSwarm";

export { IndSmartCity } from "./IndSmartCity";
export type { IndSmartCityProps } from "./IndSmartCity";

// 地形与地理
export { IndTerrainMap } from "./IndTerrainMap";
export type { IndTerrainMapProps } from "./IndTerrainMap";

// 建筑工程
export { IndBuildingGrowth } from "./IndBuildingGrowth";
export type { IndBuildingGrowthProps } from "./IndBuildingGrowth";

// 气象模拟
export { IndWeatherSim } from "./IndWeatherSim";
export type { IndWeatherSimProps } from "./IndWeatherSim";

// 汽车工程
export { IndCarSuspension } from "./IndCarSuspension";
export type { IndCarSuspensionProps } from "./IndCarSuspension";
