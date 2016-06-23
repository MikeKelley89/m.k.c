var map_link_ids = '';
    var map_link_running_index = 1;
    var map_allow_generate_code = true;
	var imageFileName = '';
	var imageFilePath = '';

$.fn.qtip.defaults = $.extend(true, {}, $.fn.qtip.defaults, {
 
		position	: { my : "right middle", at : "left middle", x: "-24"},
		style		: { classes: "qtip-light qtip-shadow mkc"},
		show		: {solo: "true"}
 
	});

    $(document).ready(function() {
        //window.onbeforeunload = "Are you sure you want to leave? Your image map will not be saved!";
		
		$('.cssmap_button').button();
		$('.cssmap_button').button('disable');	
		
		$('.borderSettings').css({
			'border-width': $('.borderWidth').val()+'px',
			'border-style': $('.borderStyle').val(),
			'border-color': $('.borderColor').val(),
	  });
	  $('.borderWidth, .borderStyle').change(function () {
			$('.borderSettings, .map_link').css({
				'border-width': $('.borderWidth').val()+'px',
				'border-style': $('.borderStyle').val()
			});
	  });
	  $('.borderColor').keyup(function() {
			$('.borderSettings, .map_link').css({
				'border-color': $('.borderColor').val()
			});
	  });
        
		
	});
        
    $('#map_link_name').keyup(function(){
        if ($(this).val() >= 0) {
			$('.cssmap_button').button('disable');
		} else {		
			$('.cssmap_button').button('enable');
		}
    })
		
		
        $('#cssmap_tab_container').tabs({
            activate: tab_select
        });
		
		
		
		function imageInput(fileInput) {
			
			//resets
			map_link_ids = new Array();
			$('#map_link_name').prop('disabled', false);
			$('#map_link_name').val('');
			$('.cssmap_button').button('disable');
			$('.map_link, .ui-dialog, .ui-dialog-content').remove();
			imageFileName = fileInput.files[0].name;
			imageFilePath = URL.createObjectURL(event.target.files[0]);
			map_link_running_index = 1;
			
			 
			 var img = $(document.createElement('img'));
                img.attr('src', imageFilePath);
                img.attr('title', imageFileName);
				img.attr('id', 'addLinksImg');
                img.css('position', 'absolute');
                img.css('top', 0);
                img.css('left', 0);
                
				 img.load(function() {
                    $('#visual_map_container').css('height', (this.height+50)+'px');
                });
				
                    
                $('#visual_map_container img').remove();
                $('#visual_map_container').append(img);
                $('#cssmap_tab_container').tabs({active: 1});
		};
       
	   
	   
        $('#cssmap_new_link').click(function () {
			$('#map_link_name').prop('disabled', true);
            var $new_id = $('#map_link_name').val()+'_'+(map_link_running_index);
            map_link_ids.push($new_id);
            map_link_running_index++;
            
            //draggable, resizeable box for link
            var map_link = $(document.createElement('a'));
            map_link.attr('id', $new_id);
            map_link.css({
			  'width': '150px',
			  'height':'80px',
			  'border-width': $('.borderWidth').val() + 'px',
			  'border-style': $('.borderStyle').val(),
			  'border-color': $('.borderColor').val()
			});
            map_link.addClass('map_link');
            map_link.resizable({
				containment: '#addLinksImg',
				grid: [ 1, 1 ]
				}).draggable({
                containment: '#addLinksImg',
				snap: true,
				snapTolerance: 2,
				grid: [ 1, 1 ],
				scroll: false
            });
            map_link.css('position', 'absolute');
            map_link.css('top', (50 + (map_link_running_index * 10))+'px');
            map_link.css('left', (map_link_running_index * 10)+'px');
            
                var edit_btn = $(document.createElement('a'));
                edit_btn.text('Edit');
                edit_btn.attr('onclick', '$(\'#' + $new_id + '_properties\').dialog(\'open\');');
                edit_btn.button({
                    icons: {
                        primary: "ui-icon-pencil"
                    },
                    text: false
                });
                map_link.append(edit_btn);
                
                var delete_btn = $(document.createElement('a'));
                delete_btn.text('Delete');
                delete_btn.attr('onclick', 'delete_link(\'' + $new_id + '\');');
                delete_btn.button({
                    icons: {
                        primary: "ui-icon-trash"
                    },
                    text: false
                });
                map_link.append(delete_btn);
           
            $('#visual_map_container').append(map_link);
			
            
            //properties dialog for link
            var map_link_properties = $(document.createElement('div'));
            map_link_properties.attr('id', $new_id + '_properties');
            map_link_properties.attr('title', $new_id + ' Properties');
            map_link_properties.html(
                '<table><tbody>' +
                    '<tr><td title="Required. This provides a fallback if your hovermap stops working temporarily."><i class="fa fa-question-circle-o required"></i> Link Text</td>' +
                    '<td><input id="' + $new_id + '_text" type="text"></td></tr>' +
					'<tr><td title="Required. No spaces or special characters allowed."><i class="fa fa-question-circle-o required"></i> Name</td>' +
                    '<td><input id="' + $new_id + '_url" type="text"></td></tr>' +
                    '<tr><td title="Optional. Usually the same as Link Text. This can be helpful for accessibility reasons."><i class="fa fa-question-circle-o optional"></i> Title</td>' +
                    '<td><input id="' + $new_id + '_title" type="text"></td></tr>' +
				/*	'<tr><td title="Optional. This moves the popup box X pixels horizontally. Positive values move it to the right."><i class="fa fa-question-circle-o optional"></i> X offset</td>' +
                    '<td><input id="' + $new_id + '_xOffset" type="number"></td></tr>' +
					'<tr><td title="Optional. This moves the popup box Y pixels vertically. Positive values move it down."><i class="fa fa-question-circle-o optional"></i> Y offset</td>' +
                    '<td><input id="' + $new_id + '_yOffset" type="number"></td></tr>' +
					'<tr><td colspan="2">Make this a circle? <input type="radio" name="circle_' + $new_id +'" value="yes"> Yes <input type="radio" name="circle_' + $new_id +'" value="no" checked="checked"> No</td></tr>'+ */
					'</tbody></table>'
			);
				
            $('#cssmap_tab_container').append(map_link_properties);
			
            $('#' + $new_id + '_properties').dialog({
                autoOpen: true,
                modal: true
            });
            
            $("td[title!=''][title]").qtip();
		
		/* This works, but I need a way to tie it into the CURRENT properties popup, and then tie the result into
		    the corresponding anchor box (i.e., make the correct box turn into a circle if someone picks "yes" on one 
			of the popups. And then how am I going to make it a circle without losing the properties icons? Also, if user
			chooses to make a circle, they should have the option to make a perfect/scaling circle. Also, need to make the
			radio inputs unique to each property box (just inherit the property ID number).
			
		$('input[name="circle"]').change(function(){
			var makeCircle = $('input[name="circle"]:checked').val();
			if (makeCircle==="yes") {
				alert('yes');
			} else {
				alert('no');
			}
		});
		*/
		
		/*
		$('input[type="radio"]').change(function(){
			//alert($(this).attr('name'));
			var makeCircle = $(this).attr('name');
			//var makeCircle = $('input[name="'makeCircle'"]:checked').val();
			alert(makeCircle);
			if (makeCircle==="yes") {
				alert('yes');
			} else {
				alert('no');
			}
		});
		*/
		
		
		/*
		$('input[type="radio"]').click(function(){
				if( $(this).attr('value').prop("checked") ) {
					//alert($(this).val('value'));
					//var thisCircle = $(this).attr('name');
					alert('yes');
					alert($(this).attr('name'));
				} else {
					alert('no');
				}
		});
		*/
		
		
        });
    
	
    function delete_link(id) {
        $('#' + id).remove();
        $('#' + id + 'properties').remove();
        map_link_ids.splice(map_link_ids.indexOf(id), 1);
    }
       
    function tab_select(event, ui) {
        
        var tab_name = ui.newTab + '';
        
        if( tab_name.indexOf($('#cssmap_visual_map_tab').parent()) != -1 ) {
            map_allow_generate_code = true;
			$('.qtip').remove();
        }
		
		if( (tab_name.indexOf($('#cssmap_generated_code_tab').parent()) != -1) ||
            (tab_name.indexOf($('#cssmap_preview_tab').parent()) != -1) ) {
            
            var map_width = $('#visual_map_container').css('width');
            var map_height = $('#visual_map_container').css('height');
            
            //generate css rules
            var codeCSS = ' /* These rules are for <add your description here> */' + "\n" +
			"\n" + '.hoverMap#' + $('#map_link_name').val() + ':hover .mapLink {border: ' + $('.borderWidth').val()+'px ' + $('.borderStyle').val() + ' ' + $('.borderColor').val()  + ';}' + "\n";
			
			/* This is the old, original stuff stuff
			'<style type="text/css">' + "\n" +
                "\t" + '.map_image { display: block; width: ' + map_width + '; height: ' + map_height + '; position: relative; background-position: 0 0; background-repeat: no-repeat; }' + "\n" +
                "\t" + '.map_image .map_link { display: block; position: absolute; text-indent: -999em; overflow: hidden; }' + "\n" + */
				       
            for(var i=0; i<map_link_ids.length; i++) {
                var a = $('#' + map_link_ids[i]);
                
				/*var parent_offset = a.offsetParent().offset();
                var real_rel_position_top = (a.offset().top - parent_offset.top) + 'px';
                var real_rel_position_left = (a.offset().left - parent_offset.left) + 'px';
                */
                codeCSS += "\n" + '#' + map_link_ids[i] + ' { width: ' + a.css('width') + '; height: ' + a.css('height') + '; top: '+ a.css('top') + '; left: ' + a.css('left') + '; }' ; 
            }
			
            var image_url = $('#visual_map_container>img').attr('src');
            
            //now generate the html
            var codeHTML = '<div class="hoverMap" id="' + $('#map_link_name').val() + '">' +
			"\n \t" + '<img src="images/' + imageFileName + '" class="mapImage" />' + "\n" +
			"\n \t" + '<div class="overlay"></div>' + "\n";
			
            var popupDivs = "\n";
			
            for(var i=0; i<map_link_ids.length; i++) {
                var text = $('#' + map_link_ids[i] + '_text').val();
                var title = $('#' + map_link_ids[i] + '_title').val();
                var url = $('#' + map_link_ids[i] + '_url').val();
            				
                codeHTML += "\n \t" + '<a class="mapLink" id="' + map_link_ids[i] + '" title="' + title + '" href="#' + url + '">' + text + '</a>';
				popupDivs += "\n" + '<div class="imageMapPop" id="' + url +'">' + "\n \t" + '<p>Put something useful here.</p>' + "\n" + '</div>';
            }
            
            codeHTML += "\n" + '</div>';
            
            if(map_allow_generate_code) {
                $('#cssmap_preview_tab').html('<style type="text/css">'+ "\n" + codeCSS + "\n" + '</style>' + "\n" +
				codeHTML + popupDivs);
				$('#cssmap_preview_tab img').attr('src', imageFilePath);
			    $('#map_css_container').text(codeCSS);
				$('#map_html_container').text(codeHTML + popupDivs);
            }
            
            map_allow_generate_code = false;
            
            prettyPrint();
	    LoadMyJs('https://rawgit.com/MikeKelley89/m.k.c/master/js/hoverMap.js');
        }
    }
    
    if (!Array.prototype.indexOf)
    {
      Array.prototype.indexOf = function(elt /*, from*/)
      {
        var len = this.length;
    
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
          from += len;
    
        for (; from < len; from++)
        {
          if (from in this &&
              this[from] === elt)
            return from;
        }
        return -1;
      };
    }
    
	//]]> 
