module.exports = {
  template:'<div class="bed-title">'+
              '<div v-show="!privateStore.isEditingTitle">'+
                '<p class="box-title" style="float: left;color:#fff">' +
                  // '{{ sharedStore.title }}, {{sharedStore.projectSettings[sharedStore.currentSelectProjectIndex].size}}, {{productText}}' +
                  '{{ sharedStore.title }}' +
                '</p>' +
                '<img v-show="!sharedStore.projectInfo.isInCart && !sharedStore.projectInfo.isOrdered" class="title-edit-icon" title="Click to edit title" v-on:click="handleShowEdit" src="assets/img/title-edit.svg" />'+
              '</div>'+
              '<div v-show="privateStore.isEditingTitle">'+
                  '<div class="box-title-edit">'+
                      '<input class="title-edit" type="text" maxlength="50" v-model="privateStore.title" v-on:keyUp="handleInputKeyEvent"/>' +
                      '<img class="icon-done" v-on:click="handleTitleEditDone" src="assets/img/title-done.svg" />'+
                      '<img class="icon-delete" v-on:click="handleTitleDelete" src="assets/img/title-delete.svg" />'+
                  '</div>'+
                  '<span v-show="privateStore.isTitleInvalid" class="title-warn" style="z-index: 1;">{{privateStore.InvalidText}}</span>'+
              '</div>' +
            '</div>',
  data:function() {
    return {
      privateStore:{
        isEditingTitle: false,
        isTitleInvalid: false,
        InvalidText: '',
        title: ''
      },
      sharedStore: Store,
    }
  },
  methods:{
    handleInputKeyEvent: function(event) {
      // alert(event.keyCode);
      switch(event.keyCode) {
        case 27:
        this.privateStore.isEditingTitle = false;
        this.privateStore.isTitleInvalid = false;
        break;
        case 13:
        this.handleTitleEditDone();
      }
    },
    handleShowEdit: function() {
      this.privateStore.title = this.sharedStore.title;
      this.privateStore.isEditingTitle = true;
      setTimeout(function(){
        $('.title-edit').focus();
      },0)
    },
    handleTitleEditDone: function() {
      var title = this.privateStore.title;
      if (!title.trim()) {
        this.privateStore.isTitleInvalid = true;
        this.privateStore.InvalidText = "Title is required"
      } else if (!(/^[a-zA-Z 0-9\d_\s\-]+$/.test(title))){
        this.privateStore.isTitleInvalid = true;

        this.privateStore.InvalidText = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title"

      } else if (title !== this.sharedStore.title){
        require('ProjectController').changeProjectTitle(this.privateStore.title,this,'dispatchUpdateAlbumResponse');
      } else if(title === this.sharedStore.title) {
        this.privateStore.isEditingTitle = false;
      }
    },
    handleTitleDelete: function() {
      this.privateStore.isEditingTitle = false;
      this.privateStore.isTitleInvalid = false;
    }
  },
  events:{
     notifyUpdateAlbumResponse:function(isValid,text){
        this.privateStore.isTitleInvalid=isValid;
        if(this.privateStore.isTitleInvalid){
            this.privateStore.InvalidText= "Please use a name you haven't used before";
        }else{
            this.privateStore.isEditingTitle = false;
            this.sharedStore.title = this.privateStore.title;
            require('ProjectController').handledSaveOldProject(this);
        }
    }
  }
}
