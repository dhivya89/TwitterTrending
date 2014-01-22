var App = Em.Application.create({
	ready: function(){
		App.Topic = Em.Object.extend({});

		App.Tweet = Em.Object.extend({});

		App.TopicController = Em.ArrayController.create({
			loadTopics: function(){
				var self = this;
				$.getJSON('http://api.twitter.com/1/trends/daily.json?callback=?', function(data){
					var timestamps = [];
					for(var date in data.trends){
						timestamps.push(date);
					}
					timestamps.sort();
					var trends = [];
					for(var topic in data.trends[timestamps[0]]){
						if(typeof(data.trends[timestamps[0]][topic]) == 'object'){
							trends.pushObject(App.Topic.create({name:data.trends[timestamps[0]][topic].name}));
						}
					}
					App.TopicController.set('content',trends);
				});
			}.property()
		});
		App.TopicController.get('loadTopics');
		//setInterval('App.TopicController.get(\'loadTopics\')',1000);

		App.TweetController = Em.ArrayController.create({
			loadTweets: function(key,value){
				var self = this;
				$.getJSON('http://search.twitter.com/search.json?q='+value+'&callback=?', function(data){
					var tweets = [];
					for(var tweet in data.results){
						if(typeof(data.results[tweet]) == 'object'){
							var datetime = new Date(data.results[tweet].created_at);
							data.results[tweet].date = datetime.format("dddd, mmmm dS yyyy");
							data.results[tweet].time = datetime.format("h:MM:ss TT");
							data.results[tweet].topic = unescape(value);
							tweets.pushObject(App.Tweet.create(data.results[tweet]));
						}
					}
					App.TweetController.set('content',tweets);
				});
			}.property()
		});
		App.TweetController.set('loadTweets','twitter');
		//setInterval('App.TweetController.set(\'loadTweets\',\'twitter\')',1000);

		App.TopicView = Em.View.create({
			templateName: 'topics',
			tagName: 'nav',
		  	topicsBinding: 'App.TopicController',
		  	selectTopic: function(event){
				App.TweetController.set('loadTweets',escape(event.context.name));
			}
		});
		App.TopicView.appendTo('#container');

		App.TweetView = Em.View.create({
			templateName: 'tweets',
			tagName: 'section',
			tweetsBinding: 'App.TweetController'
		});
		App.TweetView.appendTo('#container');
	}
});