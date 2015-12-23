
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
		/*
		 * x軸を描画するための処理が増えてきたため、メソッドを分割する
		 */
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
		/*
		 * x軸の目盛りのラベルを描画する
		 * これらの文字列は、仕様上目盛りと目盛りの間に表示することになる
		 * よって2つの目盛りの中央のx座標と、文字列の中央のx座標が一致するように、textAlignにcenterを設定する
		 * また、文字列の上端のy座標と目盛りの下端のy座標を一致させるため、textBaselingにtopを設定する
		 */
		this.context.save();
		this.context.textAlign = 'center';
		this.context.textBaseline = 'top';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;
			
		for(var i = 0, length = this.data.subscribership.length; i < length; i++){
			this.context.fillText(this.data.subscribership[i].year, this.PADDING.LEFT + this.tickSpaceX * (i + 0.5), this.height - this.PADDING.BOTTOM + this.TICK_LENGTH);
		}
		/*
		 * x軸のラベルを描画する
		 * 表示位置の考え方はx軸の目盛りのラベルとほぼ同じ
		 */
		this.context.fillText('年', this.PADDING.LEFT + this.tickSpaceX * length, this.height - this.PADDING.BOTTOM + this.TICK_LENGTH);
		this.context.restore();
	},
	drawAxisY : function(){
		/*
		 * y軸を描画するための処理が増えてきたため、メソッドを分割する
		 */
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
		}
		this.context.restore();
	},
	drawAxisLabelY : function(){
		/*
		 * y軸の目盛りのラベルを描画する
		 * これらの文字列は、仕様上各目盛りの左側に表示することになる
		 * よって目盛りの左端のx座標と、文字列の右端のx座標が一致するように、textAlignにrightを設定する
		 * 但し、文字列が見やすいように、目盛りと文字列の間に一定のマージンを持たせている
		 * また、文字列の中央のy座標と目盛りのy座標を一致させるため、textBaselingにmiddleを設定する
		 */
		this.context.save();
		this.context.textAlign = 'right';
		this.context.textBaseline = 'middle';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;
		
		for(var i = 0; i < this.ticksY; i++){
			var y = this.height - this.PADDING.BOTTOM - this.tickSpaceY * (i + 1);
			this.context.fillText(this.formatNumber(this.maxY / this.ticksY  * (i + 1)), this.PADDING.LEFT - this.TICK_LENGTH - this.LABEL_MARGIN, y);
		}
		this.context.restore();
		
		/*
		 * y軸のラベルを描画する
		 * y軸のラベルは、y軸の目盛りのラベルと異なる考え方で配置する必要がある
		 *
		 * 文字列の中央のx座標とy軸のx座標を一致させるため、textAlignにcenterを設定する
		 * また、文字列の下端のy座標とy軸の上端のy座標を一致させるため、textBaselineにbottomを設定する
		 * 但し、文字列が見やすいように、y軸と文字列の間に一定のマージンを持たせている
		 */
		this.context.save();
		this.context.textAlign = 'center';
		this.context.textBaseline = 'bottom';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;
		this.context.fillText('契約純増数', this.PADDING.LEFT, this.PADDING.TOP - this.TICK_LENGTH);
		this.context.restore();
	},
	/*
	 * 数値を3桁ずつ「,」で区切った文字列に変換する
	 * 例えば1000000という数値を'1,000,000'という文字列に変換する
	 */
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