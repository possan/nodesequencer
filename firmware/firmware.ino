#include <LiquidCrystal.h>

int WRITEDATA = 9; // blue
int WRITELATCH = 8; // green
int WRITECLOCK = 10; // yellow

int STEPPIN = A0;
int STEPPIN2 = A1;
int STEPPIN3 = A2;
int STEPPIN4 = A3;
// int BEATPIN = 9;
// int ROTPIN1 = 10;
// int ROTPIN2 = 11;
// int LEDPIN = 9;
// int DECADECLOCK = 10;
// int DECADERESET = 11;

int PLEXDATA1 = 11;
int PLEXDATA2 = 12;
int PLEXDATA3 = 13;




//                 0____5____10___15___
char *boottext0 = ".dP\"Y8 888888 dP\"Yb ";
char *boottext1 = "`Ybo.\" 88__  dP   Yb";
char *boottext2 = "o.`Y8b 88\"\"  Yb b dP";
char *boottext3 = "8bodP' 888888 `\"YoYo";

class Knob {
  public:
    Knob(int _id ) {
      id = _id;
      value = 0;
      laststate = 0;
    }
    
    int id;
    int laststate;
    int value;
    
    void update( int a, int b ){
      int state = 0;
      if( a==0 && b == 0 ) state = 0;
      if( a==1 && b == 0 ) state = 1;
      if( a==1 && b == 1 ) state = 2;
      if( a==0 && b == 1 ) state = 3;
//      if( laststate == 0 && state == 1 ) value ++;
      if( laststate == 1 && state == 2 ) {
        value ++;
        Serial.print("K");
        Serial.print(id);
        Serial.print("+\n");
      }
//      if( laststate == 2 && state == 3 ) value ++;
//      if( laststate == 3 && state == 0 ) value ++;
//      if( laststate == 0 && state == 3 ) value --;
//      if( laststate == 3 && state == 2 ) value --;
      if( laststate == 2 && state == 1 ) {
        value --;
        Serial.print("K");
        Serial.print(id);
        Serial.print("-\n");
      }
//      if( laststate == 1 && state == 0 ) value --;
      laststate = state; 
    }
};


char commandbuffer[500] = { 0, };

LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

Knob *knobs[5];

int dummy = 1;

int ledstate[40] = { 0, };

int ledmapping[40] = { 
  0,1,2,3, 4,5,6,7,
  8,9,10,11, 12,13,14,15,
  19,18,20,16, 39,39,39,39, 
  39,39,39,39, 39,39,39,39, 
  39,39,39,39, 39,39,39,39, 
};

int nbuttons = 20;
int buttonmapping[20] = {
  0,1,2,3,4,5,6,7,
  8,9,10,11,12,13,14,15,
  16,17,18,19
};

int knobpins[10] = {
  28,29,
  26,27,
  24,25,
  22,23,
  20,21,
};

int laststep[40] = { 0, };
int steppinstate[40] = { 0, };

//int beatpinstate[32] = { 0, };
//int rotpin1state[20] = { 0, };
//int rotpin2state[20] = { 0, };

void setLed( int led, int on ) {
  ledstate[ ledmapping[ led ] ] = on;
}

void setup() {

  pinMode(WRITELATCH, OUTPUT);
  pinMode(WRITECLOCK, OUTPUT);
  pinMode(WRITEDATA, OUTPUT);
  
  pinMode(PLEXDATA1, OUTPUT);
  pinMode(PLEXDATA2, OUTPUT);
  pinMode(PLEXDATA3, OUTPUT);
    
  clear();

  knobs[0] = new Knob(1);
  knobs[1] = new Knob(2);
  knobs[2] = new Knob(3);
  knobs[3] = new Knob(4);
  knobs[4] = new Knob(5);

  Serial.begin(115200);
  Serial.println("HELLO\n");
  
  lcd.begin(16, 4);
  lcd.setCursor(0, 0); lcd.print(boottext0);
  lcd.setCursor(0, 1); lcd.print(boottext1);
  lcd.setCursor(0, 2); lcd.print(boottext2);
  lcd.setCursor(0, 3); lcd.print(boottext3);

  for( int t=0; t<40; t++ ) {
    ledstate[t] = 0;
  }

  // flash leds #1. slide right
  for( int t=0; t<20; t++ ) {
    setLed(t,1);
    updateLeds();
    delay(50);
    setLed(t,0);
  } 
  // flash leds #2 slide left
  for( int t=0; t<20; t++ ) {
    setLed(20-t,1);
    updateLeds();
    delay(10);
    setLed(20-t,0);
  }
  // flash leds #2 light all
  for( int t=0; t<20; t++ ) {
    setLed(t,1);
    updateLeds();
    delay(50);
  }
  // flash leds #2 off all
  for( int t=0; t<20; t++ ) {
    setLed(t,0);
    updateLeds();
    delay(10);
  }
  
  // run boot animation once 
}

void clear(){
    lcd.setCursor(0, 0);
    lcd.print("                    ");
    lcd.setCursor(0, 1);
    lcd.print("                    ");
    lcd.setCursor(0, 2);
    lcd.print("                    ");
    lcd.setCursor(0, 3);
    lcd.print("                    ");
}

int stepper = 0;

void handlecommand(char *cmd) {
  if( cmd[0] == 'C' ) {
    clear();
  }
  else if( cmd[0] == 'R' ) {
    int l = cmd[1] - '1';
    char *t = cmd + 2;
    if( l >= 0 && l < 4 ){
      lcd.setCursor(0, l);
      lcd.print(t);
    }
  }
  else if( cmd[0] == 'L' ) {
    int n0 = cmd[1] - '0';
    int n1 = cmd[2] - '0';
    int n2 = cmd[3] - '0';
    setLed(n0*10+n1, n2);
  }
}

void updateLeds() {
  digitalWrite(WRITELATCH, LOW);
  int byte0 = 0;
  int byte1 = 0;
  int byte2 = 0;
  for( int i=0; i<8; i++ ) {
    if( ledstate[i] == 1 ) byte0 |= 1<<i;
    if( ledstate[i+8] == 1 ) byte1 |= 1<<i;
    if( ledstate[i+16] == 1 ) byte2 |= 1<<i;
  }
  shiftOut(WRITEDATA, WRITECLOCK, MSBFIRST, byte2);
  shiftOut(WRITEDATA, WRITECLOCK, MSBFIRST, byte1);
  shiftOut(WRITEDATA, WRITECLOCK, MSBFIRST, byte0);
  digitalWrite(WRITELATCH, HIGH);  
}

void readAllPins() {
  for( int i=0; i<8; i++ ) {
    digitalWrite(PLEXDATA1, ((i&1)==1));
    digitalWrite(PLEXDATA2, ((i&2)==2));
    digitalWrite(PLEXDATA3, ((i&4)==4));
    steppinstate[i] = analogRead( STEPPIN )>512;// digitalRead( STEPPIN );
    steppinstate[8+i] = analogRead( STEPPIN2 )>512;//digitalRead( STEPPIN2 );
    steppinstate[16+i] = analogRead( STEPPIN3 )>512;//digitalRead( STEPPIN3 );
    steppinstate[24+i] = analogRead( STEPPIN4 )>512;//digitalRead( STEPPIN3 );
  }
}

void checkSerial() {
  while( Serial.available() > 0 ) {
    int l = strlen(commandbuffer);
    int c = Serial.read();
    if( c == '\n' ){
      handlecommand(commandbuffer);
      commandbuffer[0] = 0;
    }else{
      commandbuffer[l] = c;
      commandbuffer[l+1] = 0;
    }
  }
}

void sendButtonEvents() {
  
  for( int j=0; j<nbuttons; j++ ) {   
    int i = buttonmapping[j];
    
    if( steppinstate[i] != laststep[i] ) {
      if( steppinstate[i] == 1 ) {
        char buf[5] = { 'B', 'x', 'x', 'D', 0 };
        buf[1] = '0' + (i/10);
        buf[2] = '0' + (i%10);
        Serial.println(buf);
      }
      else if( steppinstate[i] == 0 ) {
        char buf[5] = { 'B', 'x', 'x', 'U', 0 };
        buf[1] = '0' + (i/10);
        buf[2] = '0' + (i%10);
        Serial.println(buf);
        buf[3] = 'C';
        Serial.println(buf);
      }
      laststep[i] = steppinstate[i];      
    } 
  }
}

void checkKnobs() {
  for (int k=0; k<5; k++) {
    int kp1 = knobpins[k*2+0];
    int kp2 = knobpins[k*2+1];    
    if (steppinstate[kp1] != laststep[kp1] || steppinstate[kp2] != laststep[kp2]) {
      knobs[k]->update( steppinstate[kp2], steppinstate[kp1] );
      laststep[kp1] = steppinstate[kp1];      
      laststep[kp2] = steppinstate[kp2];      
    }
  }
}

void loop() {
  updateLeds();  
  readAllPins();
  checkSerial();
  sendButtonEvents();
  checkKnobs();
  
 // delay(1);

}


