//pop-cult
//
//A weekend project to create a quick reference pop culture dictionary using node and fandom api.
const { sprintf } = require('sprintf-js');
var rawInput=process.argv.slice(2);
var http=require("http");
var crossWiki = sprintf("http://www.wikia.com/api/v1/Search/CrossWiki?expand=1&query=%s&lang=en&limit=1&batch=1",rawInput);
var crossWikiResult=http.get(crossWiki,function callback(res)
		{
			res.on("data",function(data)
				{
					var hot=data.toString();
				    var cool=JSON.parse(hot);
					var dom=cool["items"][0]["url"];	
					
					var wikia=sprintf("%s/api/v1/Search/List?query=%s&limit=1&minArticleQuality=10&batch=1",dom,rawInput);
					var wikiaResult=http.get(wikia,function callback(res)
						{
							res.on("data",function(data)
								{
									var pol=data.toString();
									var kns=JSON.parse(pol);
									var id=kns["items"][0]["id"];

									var wikm=sprintf("%s/api/v1/Articles/Details?ids=%s&abstract=500&width=200&height=200",dom,id);

									var wikmResult=http.get(wikm,function callback (res)
										{	res.on("data",function(data)
											{
											var fat=data.toString();
											var pool=JSON.parse(fat);
											var title=pool["items"][id]["title"];
											var url=pool["items"][id]["url"];
											var basepath=pool["basepath"];
											url=basepath+url;
											var ks=pool["items"][id]["abstract"];
											var pos=ks.indexOf(".",350);
											var string=ks.slice(0,pos+1);
											var thumbnail=pool["items"][id]["thumbnail"];
											
											var related=sprintf("%s/api/v1/RelatedPages/List?ids=%s&limit=3",dom,id);
											var relatedResult=http.get(related,function callback(res)
												{
													res.on("data",function(data)
														{
															var rel=data.toString();
															var rela=JSON.parse(rel);
															var cc=[];
															for(var i=0;i<3;i++)
															{
																cc.push(rela["items"][id][i]["title"]);

															};
															console.log("\n **"+title+"** \n");
															console.log(string);
															console.log("\nrelated: "+cc);
															console.log("\nimage:"+thumbnail);

														});
												});
											});
										});
								});
						});
				});
		});

