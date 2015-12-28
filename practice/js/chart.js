var CHART = {
	PADDING: {
		TOP: 60,
		RIGHT: 50,
		BOTTOM: 50,
		LEFT: 100
	},
	AXIS_COLOR: '#808080',
	AXIS_LABEL_COLOR: '#404040',
	LABEL_MARGIN: 10,
	TICK_MARGIN: 10,
	TICK_LENGTH: 10,
	DOTTED_LINE_PATTERN: [5, 5],
	BAR_CREVICE_RATE: 0.05,
	BAR_END_RATE: 0.1,
	init: function (data) {
		this.data = data;
		this.setParameters();
		this.setupCanvas();
	},
	setParameters: function () {
		this.$container = $('#jsi-chart-container');
		this.width = this.$container.width();
		this.height = this.$container.height();

		this.$canvas = $('<canvas/>');
		this.$canvas.attr({
			width: this.width,
			height: this.height
		});
		this.$container.append(this.$canvas);
		this.context = this.$canvas.get(0).getContext('2d');
	},
	setupCanvas: function () {
		this.setupCommonParameters();
		this.setVerticalAxisInfo();
		this.drawAxis();
		this.drawBars();
	},
	setupCommonParameters: function () {
		this.context.clearRect( 0, 0, this.width, this.height );

		this.context.lineWidth = 1;
		this.context.strokeStyle = 'none';
		this.context.fillStyle = 'none';
		this.context.font = 'italic bold 12px Verdana';
	},
	drawAxis: function () {
		this.drawAxisX();
		this.drawAxisY();
	},
	drawAxisX: function () {
		this.drawAxisLineAndTicksX();
		this.drawAxisLabelX();
	},
	drawAxisLineAndTicksX: function () {
		//設定を一時的に変更するため、保存する
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;

		//始点に移動
		this.context.beginPath();
		this.context.moveTo( this.PADDING.LEFT, this.height - this.PADDING.BOTTOM );

		//終点まで線を引く
		this.context.lineTo( this.width - this.PADDING.RIGHT, this.height - this.PADDING.BOTTOM );

		//図形を描画する
		this.context.stroke();

		//目盛りを計算して描画する
		this.tickSpaceX = Math.floor( (this.width - this.PADDING.LEFT - this.PADDING.RIGHT) / this.data.subscribership.length );
		for ( var i = 0, length = this.data.subscribership.length - 1; i < length; i++ ) {
			var x = this.PADDING.LEFT + this.tickSpaceX * (i + 1);

			this.context.beginPath();
			this.context.moveTo( x, this.height - this.PADDING.BOTTOM );
			this.context.lineTo( x, this.height - this.PADDING.BOTTOM + this.TICK_LENGTH );
			this.context.stroke();
		}

		//設定を復元する
		this.context.restore();
	},
	drawAxisLabelX: function () {
		this.context.save();
		this.context.textAlign = 'center';
		this.context.textBaseline = 'top';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;

		for ( var i = 0, length = this.data.subscribership.length; i < length; i++ ) {
			this.context.fillText( this.data.subscribership[i].year, this.PADDING.LEFT + this.tickSpaceX * (i + 0.5), this.height - this.PADDING.BOTTOM + this.TICK_LENGTH );
		}
		this.context.fillText( '年', this.PADDING.LEFT + this.tickSpaceX * length, this.height - this.PADDING.BOTTOM + this.TICK_LENGTH );
		this.context.restore();
	},
	drawAxisY: function () {
		this.drawAxisLineAndTicksY();
		this.drawAxisLabelY();
	},
	drawAxisLineAndTicksY: function () {
		this.context.save();
		this.strokeStyle = this.AXIS_COLOR;

		this.context.beginPath();
		this.context.moveTo( this.PADDING.LEFT, this.height - this.PADDING.BOTTOM );
		this.context.lineTo( this.PADDING.LEFT, this.PADDING.TOP );
		this.context.stroke();

		//目盛りを計算して描画する
		this.tickSpaceY = Math.floor( (this.height - this.PADDING.TOP - this.PADDING.BOTTOM - this.TICK_MARGIN) / this.ticksY );
		for ( var i = 0; i < this.ticksY; i++ ) {
			var y = this.height - this.PADDING.BOTTOM - this.tickSpaceY * ( i + 1 );
			this.context.beginPath();
			this.context.moveTo( this.PADDING.LEFT, y );
			this.context.lineTo( this.PADDING.LEFT - this.TICK_LENGTH, y );
			this.context.stroke();

			this.drawDottedLine( this.PADDING.LEFT, y, this.width - this.PADDING.RIGHT, y );
		}

		this.context.restore();
	},
	drawAxisLabelY: function () {
		this.context.save();
		this.context.textAlign = 'right';
		this.context.textBaseline = 'middle';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;

		for ( var i = 0; i < this.ticksY; i++ ) {
			var y = this.height - this.PADDING.BOTTOM - this.tickSpaceY * (i + 1);
			this.context.fillText( this.formatNumber( this.maxY / this.ticksY * (i + 1) ) , this.PADDING.LEFT - this.TICK_LENGTH - this.LABEL_MARGIN, y );
		}
		this.context.restore();

		this.context.save();
		this.context.textAlign = 'center';
		this.context.textBaseline = 'bottom';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;
		this.context.fillText( '契約純増数', this.PADDING.LEFT, this.PADDING.TOP - this.LABEL_MARGIN );
		this.context.restore();
	},
	setVerticalAxisInfo: function () {
		//最大値を取得
		for ( var i = 0, lengthi = this.data.subscribership.length; i < lengthi; i++ ) {
			var counts = this.data.subscribership[i].count;

			for( var j = 0, lengthj = counts.length; j < lengthj; j++ ) {
				if( i == 0 && j == 0 || this.maxY < counts[j] ) {
					this.maxY = counts[j];
				}
			}
		}
		//最大値をキリの良い値に丸める
		if ( this.maxY <= 10 ) {
			this.ticksY = this.maxY;
			return;
		}
		var digits = String( this.maxY ).length,
			base = Math.pow( 10, digits - 1 );

		this.ticksY = Math.ceil( this.maxY / base );
		this.maxY = this.ticksY * base;
	},
	drawDottedLine: function ( x1, y1, x2, y2 ) {
		var length = Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 )),
			rateX = (x2 - x1) / length,
			rateY = (y2 - y1) / length,
			startX = x1,
			startY = y1;

		while( true ) {
			for ( var i = 0, patternLength = this.DOTTED_LINE_PATTERN.length; i < patternLength; i += 2 ) {
				var endX = startX + this.DOTTED_LINE_PATTERN[i] * rateX,
					endY = startY + this.DOTTED_LINE_PATTERN[i] * rateY;

				if( endX > x2 ) {
					return;
				}
				this.context.beginPath();
				this.context.moveTo( startX, startY );
				this.context.lineTo( endX, endY );
				this.context.stroke();

				if ( i < patternLength - 1 ) {
					startX = endX + this.DOTTED_LINE_PATTERN[i + 1] * rateX;
					startY = endY + this.DOTTED_LINE_PATTERN[i + 1] * rateY;
				}
			}
		}
	},
	drawBars: function () {
		this.context.save();

		//キャリアの数
		var barCount = this.data.carrier.length;
		/*
		各棒の幅
		var eachBarWidth = 100 * ( 1 - 0.1 * 2 - 0.05 * (3 - 1) ) / 3;
		var eachBarWidth = 100 * ( 1 - 0.2 - 0.1 ) / 3;
		var eachBarWidth = 100 * 0.7 / 3;
		var eachBarWidth = 23.333;
		*/
		var eachBarWidth = this.tickSpaceX * ( 1 - this.BAR_END_RATE * 2 - this.BAR_CREVICE_RATE * (barCount - 1) ) / barCount;
		//y軸の高さ
		var axisYHeight = this.height - this.PADDING.TOP - this.PADDING.BOTTOM - this.TICK_MARGIN;

		//年ごとにループでデータを取り出す
		for( var i = 0,length = this.data.subscribership.length; i < length; i++ ) {
			// 各キャリアの純契約増数のデータ（配列）
			var counts = this.data.subscribership[i].count;
			//各年の表示領域の左端のX座標
			var baseX = this.PADDING.LEFT + this.tickSpaceX * (i + this.BAR_END_RATE);

			//キャリアごとにループでデータを取り出す
			for( var j = 0, lengthj = counts.length; j < lengthj; j++ ) {
				var color = this.data.carrier[j].color,
					x = baseX + ( eachBarWidth + this.tickSpaceX * this.BAR_CREVICE_RATE ) * j,
					height = axisYHeight * counts[j] / this.maxY;

					this.context.fillStyle = color;
					this.context.fillRect(
						x,
						this.PADDING.TOP + this.TICK_MARGIN + axisYHeight - height,
						eachBarWidth, height, eachBarWidth );
			}
		}
		this.context.restore();
	},
	formatNumber: function ( data ) {
		data = String( data ).split('');

		for( var i = data.length - 1 - 3;i >= 0; i -= 3 ) {
			data.splice( i + 1, 0, ',' );
		}
		return data.join('');
	}
};

$(function () {
	CHART.init(BAR_DATA);
});