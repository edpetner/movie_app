// ----------------------------------------------
// - Store Helpers that Format Data for DB Here
// ----------------------------------------------


var formatObjectHelpers = {

  formatMedia: function(target, credits){
    target.cast = credits.cast.filter(function(member){
      return member.order < 15;
    });
    target.directors = [];
    target.producers = [];
    target.sound = [];
    target.photography = [];
    target.generalCrew = [];
    target.writers = [];
    target.executiveProducers = [];
    credits.crew.forEach(function(person){
      if (person.job === 'Director'){
        target.directors.push(person);
      } else if (person.job === 'Producer'){
        target.producers.push(person);
      } else if (person.department === 'Camera'){
        target.photography.push(person);
      } else if (person.department === 'Sound'){
        target.sound.push(person);
      } else if (person.department === 'Writing'){
        target.writers.push(person);
      } else if (person.job === 'Executive Producer') {
        target.executiveProducers.push(person);
      } else {
        target.generalCrew.push(person);
      }
    });
    return target;
  },
  formatPerson: function(person, credits){
    person.movies = [];
    person.tv = [];
    credits.cast.forEach(function(project){
      if (project.media_type === 'movie'){
        person.movies.push(project);
      } else {
        person.tv.push(project);
      }
    });
    return person;
  }



};

module.exports = formatObjectHelpers;
