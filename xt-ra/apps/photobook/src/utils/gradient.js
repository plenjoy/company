export function getLinearPointsByAngle(width, height, angle) {
      const start = {
        x: width / 2,
        y: height
      };
      const end = {
        x: width / 2,
        y: 0
      };

      const halfWidth = width / 2;
      const halfHeight = height / 2;

      // 高和斜边的夹角
      const delta1 = Math.atan(width / height) * 180 / Math.PI;
      // 高和两条斜边组成的夹角
      const delta2 = (360 - delta1 * 2) / 2;

      if (angle <= delta1 / 2) {
        let rot = angle * Math.PI / 180;
        start.x = halfWidth - halfHeight * Math.atan(rot);
        end.x = halfWidth + halfHeight * Math.atan(rot);
      } else if (angle > delta1 / 2 && angle <= 90) {
        let rot = (90 - angle) * Math.PI / 180;
        start.x = 0;
        start.y = halfHeight + halfWidth * Math.atan(rot);
        end.x = width;
        end.y = halfHeight - halfWidth * Math.atan(rot);
      } else if (angle > 90 && angle <= delta1 / 2 + delta2) {
        let rot = (angle - 90) * Math.PI / 180;
        start.x = 0;
        start.y = halfHeight - halfWidth * Math.atan(rot);
        end.x = width;
        end.y = halfHeight + halfWidth * Math.atan(rot);
      } else if (angle > delta1 / 2 + delta2 && angle <= 180) {
        let rot = (angle - 90) * Math.PI / 180;
        start.x = halfWidth - halfHeight * Math.atan(rot);
        start.y = 0;
        end.x = halfWidth + halfHeight * Math.atan(rot);
        end.y = height;
      } else if (angle > 180 && angle <= 3 * delta1 / 2 + delta2) {
        let rot = (angle - 180) * Math.PI / 180;
        start.x = halfWidth + halfHeight * Math.atan(rot);
        start.y = 0;
        end.x = halfWidth - halfHeight * Math.atan(rot);
        end.y = height;
      } else if (angle > 3 * delta1 / 2 + delta2 && angle <= 270) {
        let rot = (270 - angle) * Math.PI / 180;
        start.x = width;
        start.y = halfHeight - halfWidth * Math.atan(rot);
        end.x = 0;
        end.y = halfHeight + halfWidth * Math.atan(rot);
      } else if (angle > 270 && angle <= 3 * delta1 / 2 + delta2 * 2) {
        let rot = (angle - 270) * Math.PI / 180;
        start.x = width;
        start.y = halfHeight + halfWidth * Math.atan(rot);
        end.x = 0;
        end.y = halfHeight - halfWidth * Math.atan(rot);
      } else if (angle > 3 * delta1 / 2 + delta2 * 2 && angle <= 2 * delta1 + 2 * delta2) {
        let rot = (2 * delta1 + 2 * delta2 - angle) * Math.PI / 180;
        start.x = halfWidth + halfHeight * Math.atan(rot);
        start.y = height;
        end.x = halfWidth - halfHeight * Math.atan(rot);
        end.y = 0;
      }
      return {
        start,
        end
      };
    }
