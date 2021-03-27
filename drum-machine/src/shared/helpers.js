export const getAngle = (startX, startY, endX, endY) => {
  const angle = Math.atan2(endY - startY, endX - startX);
  return angle < 0 ? (2 * Math.PI) + angle : angle;
};

export const normalVector = (x, y) => {
  const mag = Math.sqrt(x * x + y * y);
  return {
    x: x / mag,
    y: y / mag
  };
};

export const getAngleDiff = (u, v) => {
  return [
    Math.acos(Math.min(1, u.x * v.x + u.y * v.y)), 
    u.y * v.x > u.x * v.y ? -1 : 1
  ];
};
