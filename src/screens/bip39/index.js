import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base'
import Bip39 from 'react-native-bip39'

function tryAsync(error, cb) {
  try {
    cb().catch(e => {
      error(e)
      console.error(e)
    })
  } catch (e) {
    error(e)
    console.error(e)
  }
}

export default class Bip39Test extends Component {

  generateMnemonic = function () {
    tryAsync(this.error, async () => {
      const mnemonic = await Bip39.generateMnemonic()
      this.info(`Random mnemonic`, mnemonic)
    })
  }
  entropyToMnemonic = function () {
    tryAsync(this.error, async () => {
      const mnemonic = await Bip39.entropyToMnemonic(`FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`)
      this.info(`Random mnemonic`, mnemonic)
    })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>Bip39</Title>
          </Body>
          <Right/>
        </Header>

        <Content style={{padding: 5}}>
          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.generateMnemonic})
                  }}>
            <Text>随机助记词</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Renderlog', {run: this.entropyToMnemonic})
                  }}>
            <Text>entropyToMnemonic</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}


const s = StyleSheet.create({
  button: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#00B8C4',
    marginBottom: 10,
  }
})
