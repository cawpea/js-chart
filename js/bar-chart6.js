
var CHART = {
	PADDING : {
		TOP : 60,
		RIGHT : 50,
		BOTTOM : 50,
		LEFT : 100
	},
	AXIS_COLOR : '#808080',
	AXIS_LABEL_COLOR : '#404040',
	LABEL_MARGIN : 10,
	TICK_MARGIN : 10,
	TICK_LENGTH : 10,
	DOTTED_LINE_PATTERN : [5, 5],
	
	init : function(data){
		this.data = data;
		this.setParameters();
		this.setupCanvas();
	},
	setParameters : function(){
		this.$container = $('#jsi-chart-container');
		
		this.width = this.$container.width();
		this.height = this.$container.height();
		
		this.$canvas = $('<canvas />');
		this.$container.append(this.$canvas);
		this.$canvas.attr({width : this.width, height : this.height});
		this.context = this.$canvas.get(0).getContext('2d');
		
		this.timerIds = [];
		this.legendAxis = [];
	},
	setupCanvas : function(){
		this.setupCommonParameters();
		this.setVeticalAxisInfo();
		this.drawAxis();
	},
	setupCommonParameters : function(){
		this.context.clearRect(0, 0, this.width, this.height);
		this.context.lineWidth = 1;
		this.context.strokeStyle = 'none';
		this.context.fillStyle = 'none';
		this.context.font = 'italic bold 12px Verdana';
	},
	setVeticalAxisInfo : function(){
		for(var i = 0, lengthi = this.data.subscribership.length; i < lengthi; i++){
			var counts = this.data.subscribership[i].count;
			
			for(var j = 0, lengthj = counts.length; j < lengthj; j++){
				if(i == 0 && j == 0 || this.maxY < counts[j]){
					this.maxY = counts[j];
				}
			}
		}
		if(this.maxY <= 10){
			this.ticksY = this.maxY;
			return;
		}
		var digits = String(this.maxY).length,
			base = Math.pow(10, digits - 1);
		
		this.ticksY = Math.ceil(this.maxY / base);
		this.maxY = this.ticksY * base;
	},
	drawAxis : function(){
		this.drawAxisX();
		this.drawAxisY();
	},
	drawAxisX : function(){
		this.drawAxisLineAndTicksX();
		this.drawAxisLabelX();
	},
	drawAxisLineAndTicksX : function(){
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;
		
		this.context.beginPath();
		this.context.moveTo(this.PADDING.LEFT, this.height - this.PADDING.BOTTOM);
		this.context.lineTo(this.width - this.PADDING.RIGHT, this.height - this.PADDING.BOTTOM);
		this.context.stroke();
		
		this.tickSpaceX = Math.floor((this.width - this.PADDING.LEFT - this.PADDING.RIGHT) / this.data.subscribership.length);
		
		for(var i = 0, length = this.data.subscribership.length - 1; i < length; i++){
			var x = this.PADDING.LEFT + this.tickSpaceX * (i + 1);
			
			this.context.beginPath();
			this.context.moveTo(x, this.height - this.PADDING.BOTTOM);
			this.context.lineTo(x, this.height - this.PADDING.BOTTOM + this.TICK_LENGTH);
			this.context.stroke();
		}
		this.context.restore();
	},
	drawAxisLabelX : function(){
		this.context.save();
		this.context.textAlign = 'center';
		this.context.textBaseline = 'top';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;
			
		for(var i = 0, length = this.data.subscribership.length; i < length; i++){
			this.context.fillText(this.data.subscribership[i].year, this.PADDING.LEFT + this.tickSpaceX * (i + 0.5), this.height - this.PADDING.BOTTOM + this.TICK_LENGTH);
		}
		this.context.fillText('年', this.PADDING.LEFT + this.tickSpaceX * length, this.height - this.PADDING.BOTTOM + this.TICK_LENGTH);
		this.context.restore();
	},
	drawAxisY : function(){
		this.drawAxisLineAndTicksY();
		this.drawAxisLabelY();
	},
	drawAxisLineAndTicksY : function(){
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;
		
		this.context.beginPath();
		this.context.moveTo(this.PADDING.LEFT, this.height - this.PADDING.BOTTOM);
		this.context.lineTo(this.PADDING.LEFT, this.PADDING.TOP);
		this.context.stroke();
		
		this.tickSpaceY = Math.floor((this.height - this.PADDING.TOP - this.PADDING.BOTTOM - this.TICK_MARGIN) / this.ticksY);
		
		for(var i = 0; i < this.ticksY; i++){
			var y = this.height - this.PADDING.BOTTOM - this.tickSpaceY * (i + 1);
			
			this.context.beginPath();
			this.context.moveTo(this.PADDING.LEFT, y);
			this.context.lineTo(this.PADDING.LEFT - this.TICK_LENGTH, y);
			this.context.stroke();
			
			this.drawDottedLine(this.PADDING.LEFT, y, this.width - this.PADDING.RIGHT, y);
		}
		this.context.restore();
	},
	drawAxisLabelY : function(){
		this.context.save();
		this.context.textAlign = 'right';
		this.context.textBaseline = 'middle';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;
		
		for(var i = 0; i < this.ticksY; i++){
			var y = this.height - this.PADDING.BOTTOM - this.tickSpaceY * (i + 1);
			this.context.fillText(this.formatNumber(this.maxY / this.ticksY  * (i + 1)), this.PADDING.LEFT - this.TICK_LENGTH - this.LABEL_MARGIN, y);
		}
		this.context.restore();
		
		this.context.save();
		this.context.textAlign = 'center';
		this.context.textBaseline = 'bottom';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;
		this.context.fillText('契約純増数', this.PADDING.LEFT, this.PADDING.TOP - this.TICK_LENGTH);
		this.context.restore();
	},
	/*
	 * DOTTED_LINE_PATTERNで、点線を構成する線分と空白の組み合わせのパターンを指定している
	 * 今回は非常に単純で「線分5px、空白5px」のパターンを繰り返す
	 * この定数の設定を変更することでパターンを変更することができる
	 */
	drawDottedLine : function(x1, y1, x2, y2){
		/*
		 * 点線を構成する各線分の始点を(startX, startY)、終点を(endX, endY)とすると、次の関係が成り立つ
		 *
		 * (x2 - x1) : (endX - startX) = 点線全体の距離 : 線分の長さ
		 * (y2 - y1) : (endY - startY) = 点線全体の距離 : 線分の長さ
		 *
		 * 上記の式を書き換えると次のようになる
		 *
		 * endX = startX + 線分の長さ * (x2 - x1) / 点線全体の距離
		 * endY = startY + 線分の長さ * (y2 - y1) / 点線全体の距離
		 *
		 * 任意の2点間の距離は次の公式で求めることができる
		 *
		 * length = √(x軸方向の距離の2乗 + y軸方向の距離の2乗)
		 *
		 * 更に
		 *
		 * rateX = (x2 - x1) / length
		 * rateY = (y2 - y1) / length
		 *
		 * とすると、endXとendYを求める式は次のように書き換えることができる
		 *
		 * endX = startX + 線分の長さ * rateX
		 * endY = startY + 線分の長さ * rateY
		 *
		 * 以上のことを踏まえると、点線を描画するロジックは次のように記述することができる
		 */
		var length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
			rateX = (x2 - x1) / length,
			rateY = (y2 - y1) / length,
			startX = x1,
			startY = y1;
			
		while(true){
			/*
			 * 下記のfor文で1パターン分の点線を描画する
			 * 点線が終点に達するまで、for文自体を何度も繰り返し実行することで、点線全体を描画する
			 */
			for(var i = 0, patternLength = this.DOTTED_LINE_PATTERN.length; i < patternLength; i += 2){
				var endX = startX + this.DOTTED_LINE_PATTERN[i] * rateX,
					endY = startY + this.DOTTED_LINE_PATTERN[i] * rateY;
				
				/*
				 * これから描画しようとしている線分が終点を超える場合は、描画を終了する
				 */
				if(endX > x2){
					return;
				}
				/*
				 * 線分を描画する
				 */
				this.context.beginPath();
				this.context.moveTo(startX, startY);
				this.context.lineTo(endX, endY);
				this.context.stroke();
				
				/*
				 * 空白を挟んだ次の線分の始点を求める
				 */
				if(i < patternLength - 1){
					startX = endX + this.DOTTED_LINE_PATTERN[i + 1] * rateX;
					startY = endY + this.DOTTED_LINE_PATTERN[i + 1] * rateY;
				}
			}
		}
	},
	formatNumber : function(data){
		data = String(data).split('');
		
		for(var i = data.length - 1 - 3; i >= 0; i -= 3){
			data.splice(i + 1, 0, ',');
		}
		return data.join('');
	},
	destroy : function(){
		this.$canvas.remove();
	}
};

$(function(){
	CHART.init(BAR_DATA);
});