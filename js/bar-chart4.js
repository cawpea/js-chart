
var CHART = {
	PADDING : {
		TOP : 60,
		RIGHT : 50,
		BOTTOM : 50,
		LEFT : 100
	},
	AXIS_COLOR : '#808080',
	LABEL_MARGIN : 10,
	TICK_MARGIN : 10,
	TICK_LENGTH : 10,
	
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
		this.$canvas.attr({width : this.width, height : this.height});
		this.$container.append(this.$canvas);
		this.context = this.$canvas.get(0).getContext('2d');
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
		/*
		 * 表示する純契約増数の値は、JSONのsubscribership配列に格納されている
		 * これらの値の中の最大値が、y軸の最大値となる
		 */
		for(var i = 0, lengthi = this.data.subscribership.length; i < lengthi; i++){
			var counts = this.data.subscribership[i].count;
			
			for(var j = 0, lengthj = counts.length; j < lengthj; j++){
				if(i == 0 && j == 0 || this.maxY < counts[j]){
					this.maxY = counts[j];
				}
			}
		}
		/*
		 * 上記の処理により、最大値はthis.maxYに格納されている
		 * この値をそのままy軸の最大値として使用することもできるが、きりの良い値に丸めた方が目盛りを描画し易い
		 * 例えば最大値が457の場合、y軸の最大値を500にすれば、目盛りを綺麗に5分割することができる
		 * 尚、最大値が10以下の場合は丸めなくても違和感がないので、丸める処理を省いている
		 */
		if(this.maxY <= 10){
			this.ticksY = this.maxY;
			return;
		}
		var digits = String(this.maxY).length,
			base = Math.pow(10, digits - 1);
		
		/*
		 * this.ticksYには目盛りの分割数を、this.maxYには丸めた後のy軸の最大値を格納する
		 */
		this.ticksY = Math.ceil(this.maxY / base);
		this.maxY = this.ticksY * base;
	},
	drawAxis : function(){
		this.drawAxisX();
		this.drawAxisY();
	},
	drawAxisX : function(){
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;
		
		this.context.beginPath();
		this.context.moveTo(this.PADDING.LEFT, this.height - this.PADDING.BOTTOM);
		this.context.lineTo(this.width - this.PADDING.RIGHT, this.height - this.PADDING.BOTTOM);
		this.context.stroke();
		
		/*
		 * x軸の目盛りの間隔を計算する(x軸の幅 / データ数)
		 */
		this.tickSpaceX = Math.floor((this.width - this.PADDING.LEFT - this.PADDING.RIGHT) / this.data.subscribership.length);
		
		/*
		 * x軸の目盛りを描画する
		 */
		for(var i = 0, length = this.data.subscribership.length - 1; i < length; i++){
			var x = this.PADDING.LEFT + this.tickSpaceX * (i + 1);
			
			this.context.beginPath();
			this.context.moveTo(x, this.height - this.PADDING.BOTTOM);
			this.context.lineTo(x, this.height - this.PADDING.BOTTOM + this.TICK_LENGTH);
			this.context.stroke();
		}
		this.context.restore();
	},
	drawAxisY : function(){
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;
		
		this.context.beginPath();
		this.context.moveTo(this.PADDING.LEFT, this.height - this.PADDING.BOTTOM);
		this.context.lineTo(this.PADDING.LEFT, this.PADDING.TOP);
		this.context.stroke();
		
		/*
		 * y軸の目盛りの間隔を計算する(y軸の幅 / 計算によって求めたy軸の分割数)
		 */
		this.tickSpaceY = Math.floor((this.height - this.PADDING.TOP - this.PADDING.BOTTOM - this.TICK_MARGIN) / this.ticksY);
		
		/*
		 * y軸の目盛りを描画する
		 */
		for(var i = 0; i < this.ticksY; i++){
			var y = this.height - this.PADDING.BOTTOM - this.tickSpaceY * (i + 1);
			
			this.context.beginPath();
			this.context.moveTo(this.PADDING.LEFT, y);
			this.context.lineTo(this.PADDING.LEFT - this.TICK_LENGTH, y);
			this.context.stroke();
		}
		this.context.restore();
	},
	destroy : function(){
		this.$canvas.remove();
	}
};

$(function(){
	CHART.init(BAR_DATA);
});