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

	init: function ( data ) {
		this.data = data;
		this.setParameters();
		this.setupCanvas();
	},
	setParameters: function () {
		this.$window = $(window);
		this.$container = $('#jsi-chart-container');
		this.containerWidth = this.$container.width();
		this.containerHeight = this.$container.height();

		this.$canvas = $('<canvas/>');
		this.$canvas.attr({
			width: this.containerWidth,
			height: this.containerHeight
		});
		this.$container.append( this.$canvas );
		this.context = this.$canvas.get(0).getContext('2d');
	},
	setupCanvas: function () {
		this.setVerticalAxisInfo();
		this.drawAxis();
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