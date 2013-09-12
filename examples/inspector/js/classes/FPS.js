/**
 * Frame Rate Monitor
 */
var FPS = (function () {
  var infoColor = "rgba(61, 61, 61, 0.9)";
  var backgroundColor = "rgb(61, 61, 61)";
  var sixtyColor = "#FF3900";
  var thirtyColor = "orange";
  var textColor = "white";

  function fps(canvas) {
    this.depth = 0;
    this.start = 0;
    this.index = 0;
    this.marks = new CircularBuffer(Int32Array);
    this.times = new CircularBuffer(Float64Array);
    this.maxFrameTime = 1000 / 20;
    this.count = 0;
    this.kinds = createEmptyObject();
    this.kindCount = 0;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.font = 12 + 'px Consolas, "Liberation Mono", Courier, monospace';
    this.fillStyles = ["rgb(85, 152, 213)", "#bfd8a7", "#d906d7"];
  }

  fps.prototype.refreshEvery = function (ms) {
    var that = this;
    this.refreshFrequency = ms;
    var lastRefresh = 0;
    function refresh() {
      var current = performance.now();
      if (current - lastRefresh > that.refreshFrequency) {
        lastRefresh = current;
        that.paint();
      }
      requestAnimationFrame(refresh);
    }
    requestAnimationFrame(refresh);
  };

  var ENTER = 0xBEEF0000 | 0;
  var LEAVE = 0xDEAD0000 | 0;

  fps.prototype.getKind = function (name) {
    if (this.kinds[name] === undefined) {
      this.kinds[name] = this.kindCount ++;
      if (this.kindCount > this.fillStyles.length) {
        this.fillStyles.push(randomStyle());
      }
    }
    return this.kinds[name];
  };

  fps.prototype.enter = function enter(name) {
    this.depth ++;
    this.marks.write(ENTER | this.getKind(name));
    this.times.write(performance.now());
  };

  fps.prototype.leave = function leave(name) {
    this.depth --;
    if (this.depth === 0) {
      this.count ++;
    }
    this.marks.write(LEAVE | this.getKind(name));
    this.times.write(performance.now());
  };

  fps.prototype.gatherFrames = function (maxFrames) {
    var stack = [];
    var times = this.times;
    var frames = [];
    this.marks.forEachInReverse(function (mark, i) {
      var time = times.get(i);
      if ((mark & 0xFFFF0000) === ENTER) {
        var kind = mark & 0xFFFF;
        var node = stack.pop();
        node.startTime = time;
        if (!stack.length) {
          frames.unshift(node);
        } else {
          var top = stack.top();
          if (!top.children) {
            top.children = [];
          }
          top.children.push(node);
        }
      } else if ((mark & 0xFFFF0000) === LEAVE) {
        if (frames.length > maxFrames) {
          return true;
        }
        var kind = mark & 0xFFFF;
        var node = { kind: kind, endTime: time };
        stack.push(node);
      }
    });
    return frames;
  };

  fps.prototype.paint = function () {
    var cw = this.canvas.width;
    var ch = this.canvas.height;
    var h = ch;
    var w = 10;
    var gap = 1;
    var maxFrames = (cw / (w + gap)) | 0;
    var frames = this.gatherFrames(maxFrames);

    var context = this.context;
    var maxFrameTime = this.maxFrameTime;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, cw, ch);
    var fillStyles = this.fillStyles;

    var totalFrameRate = 0;
    var offsetW;
    for (var i = 0; i < frames.length; i++) {
      var frame = frames[i];
      var frameTime = frame.endTime - frame.startTime;
      totalFrameRate += 1000 / frameTime;
      offsetW = i * (w + gap);
      drawNode(frame);
    }

    function drawNode(node) {
      var nodeTime = node.endTime - node.startTime;
      var h = nodeTime / maxFrameTime;
      var offsetH = (node.startTime - frame.startTime) / maxFrameTime;
      context.fillStyle = fillStyles[node.kind];
      context.fillRect(offsetW, ch - (h + offsetH) * ch, w, h * ch);
      if (node.children) {
        node.children.forEach(drawNode);
      }
    }


    /**
     * Draw Frame Lines
     */

    var lineFrames = [60, 30];
    var lineColors = [sixtyColor, thirtyColor];

    for (var i = 0; i < lineFrames.length; i++) {
      var lineH = ch - ((1000 / lineFrames[i]) / this.maxFrameTime) * ch;
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(0, lineH);
      context.lineTo(cw, lineH);
      context.strokeStyle = lineColors[i];
      context.stroke();
    }

    /**
     * Draw Info
     */
    var textOffset;
    context.fillStyle = infoColor;
    context.fillRect(0, 0, 200, 30);
    context.fillStyle = textColor;
    var averageFrameRate = (totalFrameRate / frames.length) | 0;

    textOffset = 5;
    context.fillText(String(this.count), textOffset, 18);
    textOffset += context.measureText(String(this.count)).width + 10;
    context.fillText("TFPS " + averageFrameRate, textOffset, 18);
    textOffset += context.measureText("TFPS " + averageFrameRate).width + 10;

    for (var k in this.kinds) {
      context.fillStyle = this.fillStyles[this.getKind(k)];
      this.context.fillText(k, textOffset, 18);
      textOffset += context.measureText(k).width + 10;
    }
  };

  return fps;
})();
