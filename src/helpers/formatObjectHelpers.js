// ----------------------------------------------
// - Store Helpers that Format Data for DB Here
// ----------------------------------------------


var formatObjectHelpers = {

  formatMedia: function(target){
    target.cast = target.credits.cast.filter(function(member){
      return member.order < 15;
    });
    target.crew = {};
    target.crew.directors = [];
    target.crew.producers = [];
    target.crew.sound = [];
    target.crew.photography = [];
    target.crew.generalCrew = [];
    target.crew.writers = [];
    target.crew.executiveProducers = [];
    target.crew.editors = [];
    target.credits.crew.forEach(function(person){
      if (person.job === 'Director'){
        target.crew.directors.push(person);
      } else if (person.job === 'Producer'){
        target.crew.producers.push(person);
      } else if (person.department === 'Camera'){
        target.crew.photography.push(person);
      } else if (person.department === 'Sound'){
        target.crew.sound.push(person);
      } else if (person.department === 'Writing'){
        target.crew.writers.push(person);
      } else if (person.job === 'Executive Producer') {
        target.crew.executiveProducers.push(person);
      } else if (person.job === 'Editor') {
        target.crew.editors.push(person);
      } else {
        target.crew.generalCrew.push(person);
      }
    });
    target.media = {};
    target.media.videos = target.videos.results;
    target.media.images = target.images;

    delete target.credits;
    delete target.videos;
    delete target.images;

    return target;
  },
  formatPerson: function(target){
    target.movies = [];
    target.tv = [];
    target.combined_credits.cast.forEach(function(project){
      if (project.media_type === 'movie'){
        target.movies.push(project);
      } else {
        target.tv.push(project);
      }
    });
    target.crew = {};
    target.crew.director = [];
    target.crew.producer = [];
    target.crew.sound = [];
    target.crew.photography = [];
    target.crew.generalCrew = [];
    target.crew.writer = [];
    target.crew.executiveProducer = [];
    target.crew.editor = [];
    target.combined_credits.crew.forEach(function(person){
      if (person.job === 'Director'){
        target.crew.director.push(person);
      } else if (person.job === 'Producer'){
        target.crew.producer.push(person);
      } else if (person.department === 'Camera'){
        target.crew.photography.push(person);
      } else if (person.department === 'Sound'){
        target.crew.sound.push(person);
      } else if (person.department === 'Writing'){
        target.crew.writer.push(person);
      } else if (person.job === 'Executive Producer') {
        target.crew.executiveProducer.push(person);
      } else if (person.job === 'Editor') {
        target.crew.editor.push(person);
      } else {
        target.crew.generalCrew.push(person);
      }
    });
    delete target.combined_credits;
    return target;
  }



};

module.exports = formatObjectHelpers;
