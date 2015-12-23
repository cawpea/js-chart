
var CHART = {
	init : function(data){
		this.data = data;
		this.setParameters();
	},
	setParameters : function(){
		this.$container = $('#jsi-chart-container');
		
		this.width = this.$container.width();
		this.height = this.$container.height();
		
		this.$canvas = $('<canvas />');
		this.$canvas.attr({width : this.width, height : this.height});
		this.$container.append(this.$canvas);
		
		/*
		 * canvasに描画するためには、まずcanvasの持つcontextオブジェクトを取得する
		 * しかしjQueryにはcontextオブジェクトを取得するためのメソッドが用意されていない
		 * そのためjQueryオブジェクトからDOMオブジェクトを取り出して、DOMオブジェクトの持つgetContextメソッドを直接実行する
		 *
		 * 尚、contextオブジェクトは用途に応じて何種類か用意されており、getContextメソッドの引数で指定する
		 * 例えば2D描画用、3D描画用、WEBGL用等を指定することができる
		 * サポートしているcontextオブジェクトはブラウザによって異なるが、2D描画用は必ずサポートされている
		 * canvasを使用する場合は、この2D描画用のcontextオブジェクトを取得することが多い
		 */
		this.context = this.$canvas.get(0).getContext('2d');
	},
	/*
	 * destroyメソッドは、教材のページ遷移の後始末をするために定義している
	 * canvasに描画するだけならば、このメソッドは必要ない
	 */
	destroy : function(){
		this.$canvas.remove();
	}
};

$(function(){
	CHART.init(BAR_DATA);
});