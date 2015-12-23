
var LOADER = {
	init : function(){
		this.setParameters();
		this.recoverPage();
		this.bindEvent();
		this.displayPage(this.pageIndex);
	},
	setParameters : function(){
		this.$body = $('body');
		this.$triggers = $('#jsi-command-container').find('a');
		this.$content = $('#jsi-content-container');
		this.$titles = $('#jsi-title-container').children('li');
		this.$chart = $('#jsi-chart-container');
		this.$noChart = $('#jsi-no-chart-container');
		this.$source = $('#jsi-source-container');
		this.$noSource = $('#jsi-no-source-container');
		this.$comments = $('#jsi-comment-container').children('li');
		this.pageIndex = 0;
	},
	recoverPage : function(){
		try{
			var pageIndex = window.sessionStorage.getItem('pageIndex');
			
			if(!/^\d+$/.test(pageIndex)){
				return;
			}
			this.pageIndex = parseInt(pageIndex, 10);
		}catch(e){}
	},
	bindEvent : function(){
		var myself = this;
		
		this.$triggers.each(function(){
			var $self = $(this),
				pageIndex = parseInt($self.attr('href'));
			
			$self.on('click', $.proxy(myself.displayPage, myself, pageIndex));
		});
	},
	displayPage : function(pageIndex, event){
		if(event){
			event.preventDefault();
		}
		if(this.$script){
			this.$script.remove();
		}
		if(window.CHART){
			CHART.destroy();
		}
		try{
			window.sessionStorage.setItem('pageIndex', pageIndex);
		}catch(e){}
		
		this.$triggers.removeClass('current');
		this.$triggers.eq(pageIndex).addClass('current');
		
		var chartIndex = pageIndex,
			sourceIndex = pageIndex;
			
		if(pageIndex == 0){
			chartIndex = '';
			sourceIndex = '';
		}
		if(pageIndex == 0){
			this.$source.hide();
			this.$noSource.show();
		}else{
			this.$source.show();
			this.$noSource.hide();
		}
		if(pageIndex == 1){
			this.$chart.hide();
			this.$noChart.show();
		}else{
			this.$chart.show();
			this.$noChart.hide();
		}
		var chartPath = (pageIndex == 13) ? 'js/line-chart.min.js' : ('js/bar-chart' + chartIndex + '.js'),
			sourcePath = (pageIndex == 13) ? 'data/line-carrier.json' : ((pageIndex == 1) ? 'data/bar-carrier.json' : ('js/bar-chart' + chartIndex + '.js'));
		
		if(pageIndex != 1){
			this.$script = $('<script />');
			this.$script.attr({type : 'text/javascript', src : chartPath});
			this.$body.append(this.$script);
		}
		this.$source.attr('src', sourcePath);
		
		this.$titles.hide().eq(pageIndex).show();
		this.$comments.hide().eq(pageIndex).show();
	}
};

$(function(){
	LOADER.init();
});