module.exports = {
  template: 
    '<div class="spec-download" @click="downloadHandler">' +
      '<img class="spec-download-img" src="assets/img/download.svg" />' +
      '<span class="spec-download-text">Download Card Spec</span>' +
    '</div>',
  computed: {
    specName: function() {
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
      var specNameArray = [
        currentProject.size,
        'SPEC',
        currentProject.trim,
        currentProject.orientation,
        currentProject.format
      ];

      return specNameArray.join('_');
    }
  },
  methods: {
    downloadHandler: function() {
      var product = Store.projectSettings[Store.currentSelectProjectIndex].product;
      var downloadUrl = '/template-resources/h5Client/data/' + product + '/' + this.specName + '.zip';

      window.open(downloadUrl, '_blank');
    }
  }
}
