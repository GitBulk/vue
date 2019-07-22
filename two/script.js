Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))

new Vue({
  el: '#notebook',
  data() {
    return {
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      selectedNoteId: localStorage.getItem('selected_id') || null
    }
  },
  computed: {
    notePreview () {
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },
    addButtonTitle () {
      return this.notes.length + ' notes(s) already'
    },
    selectedNote() {
      return this.notes.find(n => n.id == this.selectedNoteId)
    },
    sortedNotes () {
      return this.notes.slice()
                       .sort((a, b) => a.createdAt - b.createdAt)
                       .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
    },
    linesCount () {
      if (this.selectedNote) {
        // Count the number of new line characters
        return this.selectedNote.content.split(/\r\n|\r|\n/).length
      }
    },
    wordsCount () {
      if (this.selectedNote) {
        var s = this.selectedNote.content
        // Turn new line cahracters into white-spaces
        s = s.replace(/\n/g, ' ')
        // Exclude start and end white-spaces
        s = s.replace(/(^\s*)|(\s*$)/gi, '')
        // Turn 2 or more duplicate white-spaces into 1
        s = s.replace(/\s\s+/gi, ' ')
        // Return the number of spaces
        return s.split(' ').length
      }
    },
    characterCount () {
      if (this.selectedNote) {
        return this.selectedNote.content.split('').length;
      }
    }
  },
  methods: {
    addNote () {
      const time = Date.now()
      const note = {
        id: String(time),
        title: 'New note ' + (this.notes.length + 1),
        content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
        createdAt: time,
        favorite: false
      }
      this.notes.push(note)
    },
    selectNote (note) {
      console.log('click on ', note.id);
      this.selectedNoteId = note.id
    },
    saveNote () {
      json_notes = JSON.stringify(this.notes)
      localStorage.setItem('notes', json_notes)
      console.log('note saved: ', json_notes, ' at', new Date());
    },
    removeNote () {
      if (this.selectedNote && confirm('Delete the note ?')) {
        const index = this.notes.indexOf(this.selectedNote)
        if (index != -1) {
          this.notes.splice(index, 1)
        }
      }
    },
    favoriteNote () {
      this.selectedNote.favorite = !this.selectedNote.favorite
    }
  },
  watch: {
    notes: {
      handler: 'saveNote',
      deep: true
    },
    selectedNoteId (val, oldVal) {
      console.log('change selected_id from ', oldVal, ' to ', val)
      localStorage.setItem('selected_id', val)
    }
  },
})