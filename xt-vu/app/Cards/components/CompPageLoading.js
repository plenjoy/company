var DrawManage = require("DrawManage");
module.exports = {  
template: '<div class="bed-page-loading" v-show="sharedStore.isPageLoadingShow">'+
			'<div class="shadow-bg" style="z-index:1500;background-color:rgba(248, 248, 248, 1)"></div>'+
			'<div class="box-page-loading  fix-center" style="z-index:1501;width:96px;height:96px;border-radius:12px;border:1px solid #969696;">'+
				'<span class="font-light" style="margin-left: 23px;font-size: 12px;color:#7b7b7b;position: absolute;bottom: 20px;">Loading...</span>'+
				'<div style="font-size: 0;width: 28px;height: 28px;margin: 25px auto 8px;">'+
					'<img style="width: 50px;height: 50px;margin: -11px 0 0 -11px;" src="data:image/gif;base64,R0lGODdhZABkAMQAAAAAABcXFxwcHCQkJCwsLDQ0NDs7O0RERE1NTVVVVVtbW2NjY2pqanR0dH19fYWFhYqKipKSkpqamqOjo////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBwAVACwAAAAAZABkAAAF/2AljmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvBk8lZl06vcW31e2Woo+IpiWReN9zbKHp6b31+JngmgntvBX0Fh4CJgnMVhZBuJYqUIo4liCSCEZuVfZ6RI5qjpHYjnxWpY4Yolq2nr5NjB7oHKbQimCKwJhARxVi7urIlpSkReqInxdJYBsi6KI80xNLGWdbXOdvcXt+8NdzFEGHVyDbo6rm77tNn4Oeq+Pn6TuX2OQ8AAwakgqCgwYMGcQCEwLChwwdSEEosqNChRYYQo0xEqEOgx4H7QoocuSNBAhsOHLusMalAwUkaKVOSYdnyJcyYMsEkaFnT5k2cKrnQdOkTJdCgWIbuPNGyRYMTR5FW2ckTxYKrClY02IoCaNKaKRRgJbGAAQkGW592jUlG7NWzDOKSSKtW1dUFWUfElTuXqyq3C0rsNdvX76a7efXuNUH38FjBi0s0nnM3sInBJyavQXwCM+O0lN92jvy57pm7KDxnNq1PNcnRDCy/Tk14tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868+ZMQACH5BAkHABUALBkAGQAyADIAAAX/YCWOZGmOx3GubOuKafrO9BmrdU4i7M0aBp0JQeTZYisgUFgqrnymgpLZdJqgJWWQurOSsCMtt0q8IrPTcbf8PYfT6lHRiHKLxPE1vRLb3uE1CQoJCSxeMDgiUksrE44nCpGRhUNsLIt+JBKOnJCSgyeWP5kjnJ0rhJKEeRWmpy2DqpRUro+Bn7M6tUypoEyuY6tctqzFxsfIXJ/LCgusERES0tHTEhUL2Nna2Apx1NLg4RLN29vdceLp1pLckQuRz9XyEhHJ9vf49gwMahBq+wycUYEGjQnAfQKZEIzgr8aCgwHHQFhY0MVDiM8oNjwBkR+VByso1jMBMWGJBihbaTyAAPLExIUc97FAmXKEAwckVrJkAVMHzQYlbuIcAaGoi405fpIQOlRE0Z3GlC4VWkJnS1ZSbVLNWfRqnKxab5p46pUL2LBNR1jNc1YE0xNr1dBc8RYu1DE1T9QdWzbZ3nx0twJmIZhKCAAh+QQJBwAVACwZABkAMgAyAAAF/2AljmRpjklyrmzriomiqG9tm/F876SysDmaCYHgrRYLxSq4IhaNJWTyxBw6oSUfkioTjpxPLEmqLFVJYHFWiuuW0uoom3QWwePjOcz9veLXWyh8dkQuBisMDD9HehUpaH4nB5MHJomXK1plTYUnBpSTJguXmCYyL2EloJOHJ6SleKuhLq+KarKVNrVislCjiYtGn5Rqo7e5f8nKy8zJDc/QDQzPywUG1gXW1wUV0d7QDHgG4+Tl5N/o4ubrh+jRyezl3M309fb3FQ5xExNxDv9i+AmE8q+gPigCB94wWFBNQoUtGAL885AfC4kHSTx4EPDhCYknHkCA8EKCyRMSPGSWMMhiJMkWJk+ugLiyhciRJCLoLBFTArObHHPqfCmi58+RQUdAGMozprKbREfo3NlUJh6gJqZGLer0KtITSyNs5SohAp6vYJlm7SoG6wmtK9iqSWoi7Fiy+Ozic6F3b0uqakIAACH5BAkHABUALBkAGQAyADIAAAX/YCWOZGmODHOubOuKS6q+dG3Ks62LTcPiq4Vwd+r5TsCTcEE0GY+lZGnJbJKeSJlyaS1ho9qSgtu9Gm/h0XhY9p5JUphQ0Xb2wCnSulo331FpFUt0Ow6GDixGORUMfBVrhCcJCQoJJoeGK28seyuUCpWXmJlONKAnlaCVliejpHWTqpMurohlsbI2rreyrDqYXZ+zXa9Nw33IycrLfQ/Oz9DOyAjU1dbUDxDa29wQD3XX4djd3dJt4uEi0dDKB+7v78zy8/T1JBFt7mUR/Phd8EQg9ONXBt4BAzYEDvRnxaA+FwsjQEDm8MCKiBOtFFjhEGGJhSskiGR4woDJFQYMY5rol/GESJEkJkwgYfIkx3g7XkqIKXPmiJoeUTbRyVMmzZrLiBb1+RMpsggvTfRkKqKA0z5Kl5oAijWq1J4mrJrc2OYlyRFTS161krVEWrVBu8Bc8XarTXp17dEFq7eF0TYhAAAh+QQJBwAVACwZABkAMgAyAAAF/2AljmRpik56rmzroqnzzvQZy3VOPtB6s42G7sR7+GKroHBY4kGMpp9JuWTuIM8ocqq0NrG9kpRE9Zqc0NFYVDZ/s6R1pe2+wmGqET0XZoHjeXpdOhGFESxogGSDJwyOJ4aFfV9pJ4wlC46akJGHRF6amysQnZ51oY4LL6WTQ5mhqjWdXq+iOqSFtLZWrUOPdcDBwsPEIhESyMfIy6ZuCs8L0NHPFcvW18AKC9vc3dHX4BLNVtre5tXK17nA08/u7sXx8vP0IxMTZgkJZvf9VgnP9DHp548JQHf7ahAs+O+gAoAvFt4Lpg9hwhMSTxgw8AIBghMOqZlYKEHjxgIuPGR+NBFSAcaJKzYaQDniwIESKllUvFhDJscRBmzeHKFypTCfJYQOJZrzqMykQnE2BYYUqk0TRYNVJaEU61QzW7lG9eqxjkyaVpdKNWolrNirJ7KC/Xmi6wq28uzWY6F37wq4ZkIAACH5BAkHABUALBkAGQAyADIAAAX/YCWOZGmOUQSdbOu+FZSucG2bsnrvpOSzqVSLxjP5JMAg6wGBPIqlY+SUI5aYVmglcqTOTtinttct5abXpng8OiJLQTSp6WRHy6Nqum6///JKJGF9fm8oQiODLQ4sE44tbi90iw6VJo6YhmSaLGonlaCMl5iPWg9rI6GgLaSYhBWqli+tpVqxoja0tqpQrWOrbLW2r8TFxsdsBQbLzM0Grw3R0tMNFc7Xy33U29HY130M3NTWzAXKBsrF4tHI7e7v7gcHbAwLbPLyz1ALDP32RfjwjelHkMGNgALH8Cto8AVCea8Y1mNh4CELBDAUKDgh8R8JhPpMIBjpQsGCBRs5ZBY0EbDFSJIjEiQgcfJki4UUX7wkkUDjzBE1UxZ7iTGmT5o1jREt0VPBT6BJiS3lebRE0FdTqTo1UdOjnaxGt3I9KXQM2LBPSZi0+RWmiaZp1bJtywLuzbLI7MJzoXdvC5l9QgAAIfkECQcAFQAsGQAZADIAMgAABf9gJY5kaY7TdK5s64pp+s70Gat1Phr8erMSie7EM/hiq2BwWCoaTT+TUsgkFYoFKFKqrDaLWllp6jVhS1GSMlL+9khpEbntfsK28u7QTgSj8BVzOQeEByxOcDh5SysQEY8mhYR8JH4rEUFsJ4+cZpKEK1lVjpyQJ5+gdBWkpS+ohl6ljxA1Bp9lsrQ6kridXqmxqsLDxMXFr8CqD8vMzCII0NHS0XTLENfY2Q/T3NDV2eDX293Sws3nzsbq6+ztFQkJZQ4OZfAKCvFV8/ND9vf5+vbxo5Hg3j+AAQXSa+EPH0J5CheaaFjwxL0ZDU5ElDiioMEVC0IqcNGg5AqFE/9jsVAgksQCBiQYlMx4ct8QliFjMthJYiZNYiEXjByxk2dPk8RwLihRFOZRpMKCDiVa1ITPqC2ZVi1xlU7QpSaanuhaRuoJsVZnes15dmvan16CrkA7Fq46uu7m7gSbl4XRMiEAADs=" />'+
					// '<img src="assets/img/Loading.png" class="loading-animation" style="width: 36px;height: 36px;margin: -1px 0 0 -1px;"/>'+
				'</div>'+
			'</div>'+
		'</div>',
		data: function() {
			return {
				privateStore: {
					els: '',
					printPreviewpram: {
						width: 96,
						height: 96,
						selector: '.box-page-loading'
					},
				},
				sharedStore: Store,
				isPageShow : true
			};
		},
		computed: { 
			windowZindex: function(){
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
						elementTotal = currentCanvas.params.length || 0;

				return (elementTotal + 15) * 100;
			}
		},
		methods: { 
			
		},
		events: {
			
		},
		created: function() {
			
		},
		ready: function(){
			// var _this = this;
			// _this.$watch('sharedStore.isPageLoadingShow', function() {
		 //      if(_this.sharedStore.isPageLoadingShow) {
		 //       		setTimeout(function(){
		 //       			_this.isPageShow = false;
		 //       		},0)
		 //      }
		 //    });
	  	}
}