import React, { Component } from 'react'

class VoicePlayer extends Component {
  constructor (props) {
    super(props)

    if ('speechSynthesis' in window) {
      this.speech = this.createSpeech()
    } else {
      console.warn('The current browser does not support the speechSynthesis API.')
    }

    this.createSpeech=this.createSpeech.bind(this)
    this.speak=this.speak.bind(this)
    this.cancel=this.cancel.bind(this)
    this.pause=this.pause.bind(this)
    this.resume=this.resume.bind(this)
    
    this.state = {
      started: false,
      playing: false
    }
  }

  createSpeech(){
    const defaults = {
      text: '',
      volume: 1,
      rate: 1,
      pitch: 1,
      lang: 'en-US'
    }

    let speech = new SpeechSynthesisUtterance()

    Object.assign(speech, defaults, this.props)

    return speech
  }

  speak(){
    window.speechSynthesis.speak(this.speech)
    this.setState({ started: true, playing: true })
  }

  cancel(){
    window.speechSynthesis.cancel()
    this.setState({ started: false, playing: false })
  }

  pause(){
    window.speechSynthesis.pause()
    this.setState({ playing: false })
  }

  resume(){
    window.speechSynthesis.resume()
    this.setState({ playing: true })
  }

  componentWillReceiveProps ({ pause }) {
    if (pause && this.state.playing && this.state.started) {
      return this.pause()
    }

    if (!pause && !this.state.playing && this.state.started) {
      return this.resume()
    }
  }

  shouldComponentUpdate () {
    return false
  }

  componentDidMount () {
    let $this=this;
    const events = [
      { name: 'start', action: $this.props.onStart },
      { name: 'error', action: $this.props.onError },
      { name: 'pause', action: $this.props.onPause },
      { name: 'resume', action: $this.props.onResume }
    ]

    for (var i = 0, len = events.length; i < len; i++) {
      $this.speech.addEventListener(events[i].name, events[i].action)
    }

    this.speech.addEventListener('end', function(){
      $this.setState({ started: false })
      $this.props.onEnd()
    })

    if (this.props.play) {
      this.speak()
    }
  }

  componentWillUnmount () {
    this.cancel()
  }

  render () {
    return null
  }
}

export default VoicePlayer

