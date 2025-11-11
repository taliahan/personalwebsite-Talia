// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// State variables
let waypoints = [];
let currentWaypointIndex = 0;
let isPlaying = false;
let animationId = null;
let speed = 100; // pixels per second

// Avatar state
let avatarX = 0;
let avatarY = 0;
let startX = 0;
let startY = 0;
let totalDistance = 0;
let currentSegmentDistance = 0;
let segmentProgress = 0;

// Grid settings
const GRID_SIZE = 50;
const AVATAR_RADIUS = 8;

// Initialize canvas
function initCanvas() {
  avatarX = canvas.width / 2;
  avatarY = canvas.height / 2;
  startX = avatarX;
  startY = avatarY;
  draw();
}

// Draw grid
function drawGrid() {
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  
  // Vertical lines
  for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Center axes (darker)
  ctx.strokeStyle = '#bdbdbd';
  ctx.lineWidth = 2;
  
  // Vertical center line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  
  // Horizontal center line
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  
  // Origin label
  ctx.fillStyle = '#999';
  ctx.font = '12px sans-serif';
  ctx.fillText('(0, 0)', canvas.width / 2 + 5, canvas.height / 2 - 5);
}

// Draw waypoints
function drawWaypoints() {
  if (waypoints.length === 0) return;
  
  // Draw path lines
  ctx.strokeStyle = '#EC407A';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(waypoints[i].x, waypoints[i].y);
    ctx.lineTo(waypoints[i + 1].x, waypoints[i + 1].y);
    ctx.stroke();
  }
  
  ctx.setLineDash([]);
  
  // Draw waypoint circles
  waypoints.forEach((point, index) => {
    ctx.fillStyle = index === currentWaypointIndex ? '#D81B60' : '#EC407A';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw waypoint number
    ctx.fillStyle = 'white';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((index + 1).toString(), point.x, point.y);
  });
}

// Draw displacement vector
function drawDisplacementVector() {
  if (waypoints.length === 0) return;
  
  const deltaX = avatarX - startX;
  const deltaY = avatarY - startY;
  
  // Only draw if there's actual displacement
  if (Math.abs(deltaX) < 0.1 && Math.abs(deltaY) < 0.1) return;
  
  // Draw arrow from start to current position
  ctx.strokeStyle = '#E91E63';
  ctx.fillStyle = '#E91E63';
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(avatarX, avatarY);
  ctx.stroke();
  
  // Draw arrowhead
  const angle = Math.atan2(deltaY, deltaX);
  const arrowLength = 15;
  const arrowAngle = Math.PI / 6;
  
  ctx.beginPath();
  ctx.moveTo(avatarX, avatarY);
  ctx.lineTo(
    avatarX - arrowLength * Math.cos(angle - arrowAngle),
    avatarY - arrowLength * Math.sin(angle - arrowAngle)
  );
  ctx.lineTo(
    avatarX - arrowLength * Math.cos(angle + arrowAngle),
    avatarY - arrowLength * Math.sin(angle + arrowAngle)
  );
  ctx.closePath();
  ctx.fill();
  
  // Label displacement vector
  const midX = (startX + avatarX) / 2;
  const midY = (startY + avatarY) / 2;
  ctx.fillStyle = '#E91E63';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Δr', midX, midY - 15);
}

// Draw avatar
function drawAvatar() {
  // Draw avatar circle
  ctx.fillStyle = '#D81B60';
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, AVATAR_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw avatar outline
  ctx.strokeStyle = '#AD1457';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, AVATAR_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw avatar center dot
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, 3, 0, Math.PI * 2);
  ctx.fill();
}

// Main draw function
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  drawGrid();
  
  // Draw waypoints and path
  drawWaypoints();
  
  // Draw displacement vector
  drawDisplacementVector();
  
  // Draw avatar
  drawAvatar();
  
  // Update display values
  updateDisplay();
}

// Calculate distance between two points
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Update display values
function updateDisplay() {
  // Convert canvas coordinates to physics coordinates
  // Canvas origin (0,0) is top-left, physics origin is center
  const physicsX = avatarX - canvas.width / 2;
  const physicsY = -(avatarY - canvas.height / 2); // Flip Y axis
  
  // Position
  document.getElementById('positionValue').textContent = 
    `(${physicsX.toFixed(1)}, ${physicsY.toFixed(1)})`;
  
  // Distance traveled
  document.getElementById('distanceValue').textContent = 
    `${totalDistance.toFixed(1)} px`;
  
  // Displacement components
  const deltaX = physicsX - (startX - canvas.width / 2);
  const deltaY = physicsY - (-(startY - canvas.height / 2));
  
  document.getElementById('deltaXValue').textContent = `${deltaX.toFixed(1)} px`;
  document.getElementById('deltaYValue').textContent = `${deltaY.toFixed(1)} px`;
  
  // Displacement magnitude
  const displacementMag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  document.getElementById('displacementMagValue').textContent = 
    `${displacementMag.toFixed(1)} px`;
  
  // Displacement direction (in degrees)
  const directionRad = Math.atan2(deltaY, deltaX);
  const directionDeg = directionRad * 180 / Math.PI;
  document.getElementById('displacementDirValue').textContent = 
    `${directionDeg.toFixed(1)}°`;
}

// Animation loop
function animate() {
  if (!isPlaying || waypoints.length === 0) {
    animationId = requestAnimationFrame(animate);
    return;
  }
  
  if (currentWaypointIndex >= waypoints.length) {
    // Reached end of path
    isPlaying = false;
    document.getElementById('playPauseBtn').textContent = 'Play';
    animationId = requestAnimationFrame(animate);
    return;
  }
  
  const targetWaypoint = waypoints[currentWaypointIndex];
  const dx = targetWaypoint.x - avatarX;
  const dy = targetWaypoint.y - avatarY;
  const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
  
  if (distanceToTarget < 1) {
    // Reached waypoint, move to next
    avatarX = targetWaypoint.x;
    avatarY = targetWaypoint.y;
    currentWaypointIndex++;
    segmentProgress = 0;
    
    if (currentWaypointIndex < waypoints.length) {
      // Calculate distance for next segment
      const nextWaypoint = waypoints[currentWaypointIndex];
      currentSegmentDistance = distance(
        avatarX, avatarY,
        nextWaypoint.x, nextWaypoint.y
      );
    }
  } else {
    // Move towards target
    const dt = 1 / 60; // Assume 60 FPS
    const pixelsPerFrame = speed * dt;
    
    if (distanceToTarget <= pixelsPerFrame) {
      // Will reach target this frame
      totalDistance += distanceToTarget;
      avatarX = targetWaypoint.x;
      avatarY = targetWaypoint.y;
    } else {
      // Move towards target
      const moveX = (dx / distanceToTarget) * pixelsPerFrame;
      const moveY = (dy / distanceToTarget) * pixelsPerFrame;
      
      avatarX += moveX;
      avatarY += moveY;
      totalDistance += pixelsPerFrame;
    }
  }
  
  draw();
  animationId = requestAnimationFrame(animate);
}

// Canvas click handler
canvas.addEventListener('click', (e) => {
  if (isPlaying) return; // Don't add waypoints while playing
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  waypoints.push({ x, y });
  
  // If this is the first waypoint, set it as start position
  if (waypoints.length === 1) {
    startX = x;
    startY = y;
    avatarX = x;
    avatarY = y;
    totalDistance = 0;
  }
  
  draw();
});

// Play/Pause button
document.getElementById('playPauseBtn').addEventListener('click', () => {
  if (waypoints.length === 0) {
    alert('Please add at least one waypoint by clicking on the canvas.');
    return;
  }
  
  isPlaying = !isPlaying;
  
  if (isPlaying) {
    document.getElementById('playPauseBtn').textContent = 'Pause';
    
    // If at end of path, restart
    if (currentWaypointIndex >= waypoints.length) {
      currentWaypointIndex = 0;
      avatarX = waypoints[0].x;
      avatarY = waypoints[0].y;
      startX = waypoints[0].x;
      startY = waypoints[0].y;
      totalDistance = 0;
    }
    
    // Calculate distance for current segment
    if (currentWaypointIndex < waypoints.length) {
      const targetWaypoint = waypoints[currentWaypointIndex];
      currentSegmentDistance = distance(
        avatarX, avatarY,
        targetWaypoint.x, targetWaypoint.y
      );
    }
    
    if (!animationId) {
      animate();
    }
  } else {
    document.getElementById('playPauseBtn').textContent = 'Play';
  }
});

// Clear button
document.getElementById('clearBtn').addEventListener('click', () => {
  waypoints = [];
  currentWaypointIndex = 0;
  isPlaying = false;
  totalDistance = 0;
  document.getElementById('playPauseBtn').textContent = 'Play';
  initCanvas();
});

// Speed slider
document.getElementById('speedSlider').addEventListener('input', (e) => {
  speed = parseInt(e.target.value);
  document.getElementById('speedValue').textContent = speed;
});

// Initialize
initCanvas();
animate();

