var LINE_CHART = {
	PADDING: {
		TOP: 60,
		RIGHT: 50,
		BOTTOM: 50,
		LEFT: 100
	},
	AXIS_COLOR: '#666666',
	AXIS_LABEL_COLOR: '#999999',
	TICK_MARGIN: 10,
	TICK_LENGTH: 10,
	LABEL_MARGIN: 10,
	DOTTED_LINE_PATTERN: [5, 5],
	CIRCLE_SIZE: 3,
	LINE_WIDTH: 2,

	init: function ( data ) {
		this.data = data;
		this.setParameters();
		this.bindEvent();
		this.setupCanvas();
	},
	setParameters: function () {
		this.$window = $(window);
		this.$container = $('#jsi-chart-container');

		this.$canvas = $('<canvas/>');
		this.$container.append( this.$canvas );
		this.context = this.$canvas.get(0).getContext('2d');

		this.timerlds = [];
	},
	bindEvent: function () {
		this.$window.on('resize', $.proxy( this.watchResize, this ));
	},
	setupCanvas: function () {
		this.setupCommonParameters();
		this.setVerticalAxisInfo();
		this.drawAxis();
		this.drawChart();
	},
	setupCommonParameters: function () {
		this.containerWidth = this.$container.width();
		this.containerHeight = this.$container.height();
		this.$canvas.attr({
			width: this.containerWidth,
			height: this.containerHeight
		});
		this.context.clearRect( 0, 0, this.containerWidth, this.containerHeight );
	},
	setVerticalAxisInfo: function () {
		this.maxY = undefined;

		for( var i = 0,lengthi = this.data.length; i < lengthi; i++ ) {
			var data = this.data[i].data;
			for( var j = 0,lengthj = data.length; j < lengthj; j++ ) {
				var count = data[j].count;
				if ( this.maxY === undefined || this.maxY < count ) {
					this.maxY = count;
				}
			}
		}

		if( this.maxY <= 10 ) {
			this.ticksY = this.maxY;
			return;
		}
		var digits = String( this.maxY ).length,
			base = Math.pow( 10, digits - 1 );

		this.ticksY = Math.ceil( this.maxY / base );
		this.maxY = this.ticksY * base;
	},
	watchResize: function () {
		if( this.timerlds.length > 0 ) {
			window.cancelAnimationFrame( this.timerlds.pop() );
		}
		var timer = window.requestAnimationFrame( $.proxy( this.redrawChart, this ) );
		this.timerlds.push( timer );
	},
	redrawChart: function () {
		var width = this.$container.width();

		if( this.containerWidth !== width ) {
			this.containerWidth = width;
			this.watchResize();
			return;
		}
		this.setupCanvas();
	},
	drawAxis: function () {
		this.drawAxisX();
		this.drawAxisY();
	},
	drawAxisX: function () {
		this.drawAxisLineAndTicksX();
		this.drawAxisLabelX();
	},
	drawAxisY: function () {
		this.drawAxisLineAndTicksY();
		this.drawAxisLabelY();
	},
	drawAxisLineAndTicksX: function () {
		this.context.save();

		this.strokeStyle = this.AXIS_COLOR;

		this.context.beginPath();
		this.context.moveTo( this.PADDING.LEFT, this.containerHeight - this.PADDING.BOTTOM );
		this.context.lineTo( this.containerWidth - this.PADDING.RIGHT, this.containerHeight - this.PADDING.BOTTOM );

		this.context.stroke();

		var maxDataLength = 0;
		for( var i = 0,length = this.data.length;i < length;i++ ) {
			if( maxDataLength < this.data[i].data.length ) {
				maxDataLength = this.data[i].data.length;
			}
		}
		this.tickSpaceX = Math.floor( ( this.containerWidth - this.PADDING.LEFT - this.PADDING.RIGHT - this.TICK_MARGIN ) / ( maxDataLength - 1 ) );

		for( var i = 0; i < maxDataLength; i++ ) {
			var x = this.PADDING.LEFT + this.tickSpaceX * i;

			this.context.beginPath();
			this.context.moveTo( x, this.containerHeight - this.PADDING.BOTTOM );
			this.context.lineTo( x, this.containerHeight - this.PADDING.BOTTOM + this.TICK_LENGTH );
			this.context.stroke();
		}

		this.context.restore();
	},
	drawAxisLabelX: function () {
		this.context.save();
		this.context.textAlign = 'center';
		this.context.textBaseline = 'top';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;

		var topData = this.data[0];
		for( var i = 0, length = topData.data.length; i < length; i++ ) {
			this.context.fillText(
				topData.data[i].year,
				this.tickSpaceX * i + this.PADDING.LEFT,
				this.containerHeight - this.PADDING.BOTTOM + this.TICK_LENGTH + this.TICK_MARGIN );
		}
		this.context.textBaseline = 'middle';
		this.context.fillText(
			'年',
			this.containerWidth - this.PADDING.RIGHT + this.LABEL_MARGIN,
			this.containerHeight - this.PADDING.BOTTOM
		);
		this.context.restore();
	},
	drawAxisLineAndTicksY: function () {
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;

		this.context.beginPath();
		this.context.moveTo(
			this.PADDING.LEFT,
			this.containerHeight - this.PADDING.BOTTOM
		);
		this.context.lineTo(
			this.PADDING.LEFT,
			this.PADDING.TOP - this.TICK_MARGIN
		);
		this.context.stroke();

		this.tickSpaceY = Math.floor(
			(this.containerHeight - this.PADDING.BOTTOM - this.PADDING.TOP) / (this.ticksY - 1)
		);
		for( var i = 0; i < this.ticksY; i++ ) {
			var y = ( this.containerHeight - this.PADDING.BOTTOM ) - this.tickSpaceY * i;
			this.context.moveTo( this.PADDING.LEFT, y );
			this.context.lineTo( this.PADDING.LEFT - this.TICK_LENGTH, y );
			this.context.stroke();

			this.drawDottedLine( this.PADDING.LEFT, y, this.containerWidth - this.PADDING.RIGHT, y );
		}

		this.context.restore();
	},
	drawAxisLabelY: function () {
		this.context.save();
		this.context.textAlign = 'right';
		this.context.textBaseline = 'middle';
		this.context.fillStyle = this.AXIS_LABEL_COLOR;

		for( var i = 0; i < this.ticksY; i++ ) {
			this.context.fillText(
				this.formatPrice( this.maxY / this.ticksY * i ),
				this.PADDING.LEFT - this.TICK_LENGTH - this.TICK_MARGIN,
				this.containerHeight - this.PADDING.BOTTOM - this.tickSpaceY * i
			);
		}

		this.context.textAlign = 'center';
		this.context.textBaseline = 'bottom';
		this.context.fillText(
			'契約純増数',
			this.PADDING.LEFT,
			this.PADDING.TOP - this.TICK_MARGIN - this.LABEL_MARGIN
		);
		this.context.restore();
	},
	drawDottedLine: function ( x1, y1, x2, y2 ) {
		// 三平方の定理を使用して斜線の長さを求めている
		var length = Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) ),
			rateX = (x2 - x1) / length,
			rateY = (y2 - y1) / length,
			startX = x1,
			startY = y1;

		while( true ) {
			for( var i = 0, patternLength = this.DOTTED_LINE_PATTERN.length; i < patternLength; i += 2 ) {
				var endX = startX + this.DOTTED_LINE_PATTERN[i] * rateX,
					endY = startY + this.DOTTED_LINE_PATTERN[i] * rateY;

				if( endX > x2 ) {
					return;
				}
				this.context.beginPath();
				this.context.moveTo( startX, startY );
				this.context.lineTo( endX, endY );
				this.context.stroke();

				if( i < patternLength - 1 ) {
					startX = endX + this.DOTTED_LINE_PATTERN[i + 1] * rateX;
					startY = endY + this.DOTTED_LINE_PATTERN[i + 1] * rateY;
				}
			}
		}
	},
	drawChart: function () {
		this.parseChartData();
		this.drawChartCircle();
		this.drawChartLine();
	},
	parseChartData: function () {
		this.chartPath = [];

		for( var i = 0, lengthi = this.data.length;i < lengthi; i++ ) {
			var data = this.data[i].data;
			var color = this.data[i].color;
			var element = [];

			for( var j = 0,lengthj = data.length; j < lengthj; j++ ) {
				var count = data[j].count;
				var x = this.PADDING.LEFT + this.tickSpaceX * j;
				var y = this.containerHeight - this.PADDING.BOTTOM
				 - (( this.containerHeight - this.PADDING.TOP - this.PADDING.BOTTOM ) * ( count / this.maxY ));

				element.push({
					color: color,
					x: x,
					y: y
				});
			}
			this.chartPath.push( element );
		}
	},
	drawChartCircle: function () {
		this.context.save();

		for ( var i = 0, lengthi = this.chartPath.length; i < lengthi; i++ ) {
			var element = this.chartPath[i];
			for( var j = 0, lengthj = element.length; j < lengthj; j++ ) {
				var data = element[j];
				this.context.beginPath();
				this.context.fillStyle = data.color;
				this.context.arc( data.x, data.y, this.CIRCLE_SIZE, 0, 2 * Math.PI, true );
				this.context.fill();
			}
		}

		this.context.restore();
	},
	drawChartLine: function () {
		this.context.save();

		for( var i = 0, lengthi = this.chartPath.length; i < lengthi; i ++ ) {
			var element = this.chartPath[i];
			var startX = this.PADDING.LEFT;
			var startY = 0;

			for( var j = 0, lengthj = element.length; j < lengthj; j++ ) {
				var data = element[j];

				if( j === 0 ) {
					startY = data.y;
				}else {
					this.context.beginPath();
					this.context.strokeStyle = data.color;
					this.context.lineWidth = this.LINE_WIDTH;
					this.context.moveTo( startX, startY );
					this.context.lineTo( data.x, data.y );
					this.context.stroke();

					startX = data.x;
					startY = data.y;
				}
			}
		}

		this.context.restore();
	},
	formatPrice: function ( value ) {
		var array = String( value ).split('');

		for( var i = array.length - 3; i > 0; i -= 3 ) {
			array.splice( i, 0, ',' );
		}
		return array.join('');
	}
};

$(function () {
	LINE_CHART.init( DATA );
});