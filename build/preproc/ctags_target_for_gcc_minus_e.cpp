# 1 "/Users/wangxingyuan/Desktop/FourthFirst/multimedia-final-backend/multimedia-final-backend.ino"
// #include <UnoWiFiDevEd.h>

// #include <Dhcp.h>
// #include <Dns.h>
// #include <Ethernet.h>
// #include <EthernetClient.h>
// #include <EthernetServer.h>
// #include <EthernetUdp.h>

// #include <SPI.h>
// #include <Ethernet.h>

// byte mac[] = { 0x8E, 0xFC, 0xCD, 0x69, 0x4F, 0x2B };
// IPAddress ip(192, 168, 1, 200); // Replace with the desired IP address
// EthernetServer server(80);

// void setup() {
//   // Start serial communication for debugging
//   Serial.begin(9600);

//   // Start Ethernet connection
//   Ethernet.begin(mac, ip);
//   server.begin();

//   Serial.println("Server started");
// }

// void loop() {
//   EthernetClient client = server.available();

//   if (client) {
//     Serial.println("New client connected");
//     while (client.connected()) {
//       if (client.available()) {
//         char request[100];
//         client.readBytesUntil('\r', request, 100);
//         Serial.println(request);

//         // Send a response back to the client
//         client.println("HTTP/1.1 200 OK");
//         client.println("Content-Type: text/html");
//         client.println("Connection: close");
//         client.println();
//         client.println("<!DOCTYPE HTML>");
//         client.println("<html>");
//         client.println("<h1>Hello from Arduino Server!</h1>");
//         client.println("</html>");
//         break;
//       }
//     }

//     // Close the connection
//     delay(1);
//     client.stop();
//     Serial.println("Client disconnected");
//   }
// }
# 1 "/Users/wangxingyuan/Desktop/FourthFirst/multimedia-final-backend/test.ino"
# 2 "/Users/wangxingyuan/Desktop/FourthFirst/multimedia-final-backend/test.ino" 2

SoftwareSerial esp8266(2, 3); // RX, TX pins on Arduino

void setup() {
    Serial.begin(9600); // Serial monitor for debugging
    esp8266.begin(9600); // Start communication with ESP8266

    // Reset the ESP8266 module
    esp8266.println("AT+RST");
    delay(1000); // Wait for reset
}

void loop() {
    if (esp8266.available()) {
        Serial.println("欸");
        Serial.write(esp8266.read()); // Output data from ESP8266 to Serial monitor
    }

    if (Serial.available()) {
        Serial.println("欸欸欸");
        esp8266.write(Serial.read()); // Send data from Serial monitor to ESP8266
    }
}
