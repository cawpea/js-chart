
var CHART = {
	PADDING : {
		TOP : 60,
		RIGHT : 50,
		BOTTOM : 50,
		LEFT : 100
	},
	AXIS_COLOR : '#808080',
	
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
		this.drawAxis();
	},
	/*
	 * 描画する図形に対する共通設定がある場合は、最初に記述しておく
	 * CSSで言うところのcommon.cssのようなもの
	 * 下記と異なる設定をしたい図形がある場合は、適宜上書きする
	 */
	setupCommonParameters : function(){
		/*
		 * canvasに描画した内容をクリアする
		 * パラメータにはx座標、y座標、幅、高さを指定する
		 * 下記の場合はcanvasの全領域をクリアしている
		 */
		this.context.clearRect(0, 0, this.width, this.height);
		
		/*
		 * 線分の幅を指定する
		 */
		this.context.lineWidth = 1;
		/*
		 * 図形を描画する場合には次の2つの情報を指定する必要がある
		 * 
		 * ・図形を囲む線分の色の情報
		 * ・図形を塗り潰す色の情報
		 * 
		 * 前者はstrokeStyleプロパティに、後者はfillStyleプロパティに設定する
		 * 共通設定では両者とも非表示にしておき、必要に応じて適宜上書きする
		 */
		
		this.context.strokeStyle = 'none';
		this.context.fillStyle = 'none';
		
		/*
		 * 文字を描画する場合のフォントを設定する
		 * CSSのfontプロパティとほぼ同じ
		 */
		this.context.font = 'italic bold 12px Verdana';
	},
	drawAxis : function(){
		this.drawAxisX();
		this.drawAxisY();
	},
	drawAxisX : function(){
		/*
		 * 図形を描画するたびにstrokeStyleやfillStyleを適宜上書きする
		 * この設定は図形を描画し終わっても有効となる
		 * 元の設定に戻すためには、次のいずれかの処理を実行する必要がある
		 *
		 * ・各プロパティを元の値で上書きする
		 * ・対象の図形を描画する時だけ必要なプロパティを一時的に上書きする
		 *
		 * 後者の方法は次のようにsave/restoreメソッドを実行することで実現することができる
		 * 
		 * 1.図形の装飾情報を設定する前にsaveメソッドを実行する
		 *   これにより、それまでの設定(共通設定)が保存される
		 * 2.プロパティを上書きして図形を描画する
		 * 3.描画が終わった後にrestoreメソッドを実行する
		 *   これにより、1で保存した設定が復元される
		 */
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;
		
		/*
		 * これから新しく図形を描画することを宣言する
		 */
		this.context.beginPath();
		
		/*
		 * 描画ポイントを図形(直線)の始点の位置に移動させる
		 */
		this.context.moveTo(this.PADDING.LEFT, this.height - this.PADDING.BOTTOM);
		
		/*
		 * 直線を描画することを宣言する(引数として終点の情報を指定する)
		 */
		this.context.lineTo(this.width - this.PADDING.RIGHT, this.height - this.PADDING.BOTTOM);
		
		/*
		 * 宣言した図形(今回は直線)を描画する
		 */
		this.context.stroke();
		this.context.restore();
	},
	drawAxisY : function(){
		this.context.save();
		this.context.strokeStyle = this.AXIS_COLOR;
		
		this.context.beginPath();
		this.context.moveTo(this.PADDING.LEFT, this.height - this.PADDING.BOTTOM);
		this.context.lineTo(this.PADDING.LEFT, this.PADDING.TOP);
		this.context.stroke();
		
		this.context.restore();
	},
	destroy : function(){
		this.$canvas.remove();
	}
};

$(function(){
	CHART.init(BAR_DATA);
});