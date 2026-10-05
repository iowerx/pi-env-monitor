# Quiz: Electricity and the Single-Board Computer

Test your understanding of the Raspberry Pi, voltage, current, ground, GPIO pins, breadboards, pull-up resistors, and static safety with these review questions.

!!! mascot-tip "Think Like a Circuit"
    ![Mecha pointing out a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When a wiring question puzzles you, trace the path charge takes: out of the power pin, through the device, and back to ground. If the loop is broken anywhere, nothing works.

---

#### 1. What is a single-board computer?

<div class="upper-alpha" markdown>
1. A small computer that runs only when plugged into a laptop
2. A circuit board that holds a processor but no memory or storage
3. A complete computer built on one circuit board
4. A computer chip that can run only one program at a time
</div>

??? question "Show Answer"
    The correct answer is **C**. A single-board computer is a complete computer built on one circuit board. Its processor, memory, and connectors are all soldered onto one board. It does not need a laptop to run (A), and it has its own memory and storage (B). Nothing in the chapter limits it to one program (D). It gives up upgrades in exchange for small size, low power, and pins that connect directly to electronic parts.

    **Concept Tested:** Single Board Computer

    **See:** [A Whole Computer, Smaller Than a Credit Card](index.md#a-whole-computer-smaller-than-a-credit-card)

---

#### 2. At what voltage do the Raspberry Pi's GPIO pins run?

<div class="upper-alpha" markdown>
1. 1.8 volts
2. 2.5 volts
3. 3.3 volts
4. 5 volts
</div>

??? question "Show Answer"
    The correct answer is **C**. GPIO pins are software-controlled connections on the header, and they run at 3.3 volts. They are not 5-volt tolerant. Option D is the dangerous mix-up. The header does have 5 V power pins for devices that need them, but 5 V must never reach a GPIO pin. Doing that can destroy the pin, or even the whole processor, with no fuse and no warning. Options A and B are not the GPIO voltage.

    **Concept Tested:** GPIO Pin

    **See:** [The GPIO Pins](index.md#the-gpio-pins)

---

#### 3. What is the pin header on a Raspberry Pi?

<div class="upper-alpha" markdown>
1. The double row of 40 metal pins that jumper wires plug onto
2. The micro-USB connector that brings power into the board
3. The slot on the board where the microSD card is inserted
4. The software setting that decides whether a pin is input or output
</div>

??? question "Show Answer"
    The correct answer is **A**. The pin header is the physical connector along one edge of the board: a double row of 40 metal pins that jumper wires plug onto. On the Pi Zero 2 W it may need to be soldered on. The micro-USB connector (B) brings in power, and the microSD slot (C) holds storage. Option D describes how software controls a GPIO pin, not the physical header itself.

    **Concept Tested:** Pin Header

    **See:** [The GPIO Pins](index.md#the-gpio-pins)

---

#### 4. Which kind of jumper wire does this book use most to connect the Pi's header pins directly to a sensor's header pins?

<div class="upper-alpha" markdown>
1. Male-to-male
2. Female-to-female
3. Male-to-female
4. Soldered ribbon cable
</div>

??? question "Show Answer"
    The correct answer is **B**. A jumper wire is a short wire with a connector on each end for temporary connections. Female-to-female wires have a socket on both ends, so they slide straight onto the pins of both the Pi and the sensor. Male-to-male wires (A) join two points on a breadboard. Male-to-female wires (C) go from a breadboard to the Pi. A soldered ribbon cable (D) is not a jumper wire and is not temporary.

    **Concept Tested:** Jumper Wire

    **See:** [Wires and Breadboards](index.md#wires-and-breadboards)

---

#### 5. A 3.3-volt sensor on a 5-volt pin will likely be destroyed. A sensor that draws 1 mA on a supply that can give 500 mA is fine. What explains the difference?

<div class="upper-alpha" markdown>
1. Current is pushed into a device, but voltage is pulled out as needed
2. A supply that can give 500 mA always lowers its voltage to match
3. Small sensors can handle any voltage, but not large currents
4. Voltage is applied to a device, but current is drawn by the device as needed
</div>

??? question "Show Answer"
    The correct answer is **D**. Voltage is electrical pressure, and you choose what you apply to a device. Too much pressure destroys it. Current is the rate of flow, and the device decides how much to draw. A sensor that needs 1 mA takes 1 mA and ignores the rest. Option A reverses the two ideas. Option B is not how a supply works. Option C is backward, because voltage is the danger here, not extra current capacity.

    **Concept Tested:** Voltage and Current

    **See:** [Voltage, Current, and Ground](index.md#voltage-current-and-ground)

---

#### 6. A sensor has its power wire connected, but its ground wire is missing. What is most likely to happen?

<div class="upper-alpha" markdown>
1. The sensor works normally, because power is what makes it run
2. The sensor does nothing, acts erratic, or works briefly and then fails
3. The sensor reads exactly 0 V on every measurement it takes
4. The Raspberry Pi shuts down at once to protect the sensor
</div>

??? question "Show Answer"
    The correct answer is **B**. Ground is the 0 V reference point, and it completes the circuit loop. Charge leaves the power pin, passes through the sensor, and must return through ground. Without ground, the sensor may do nothing, act erratically, or seem to work and then fail. Option A forgets that a circuit needs a complete loop. Options C and D are not what the chapter describes. Whenever a sensor misbehaves, check ground first.

    **Concept Tested:** Ground Connection

    **See:** [Voltage, Current, and Ground](index.md#voltage-current-and-ground)

---

#### 7. Why might a GPIO input pin need a pull-up resistor?

<div class="upper-alpha" markdown>
1. It raises the pin from 3.3 V to 5 V so sensors get more power
2. It blocks static electricity from reaching the processor
3. It lets more current flow so the sensor can respond faster
4. It keeps the pin from floating and reporting random values
</div>

??? question "Show Answer"
    The correct answer is **D**. An input pin with nothing connected is floating. It picks up electrical noise and reports random values. A pull-up resistor connects the signal wire to the positive supply and gently holds it at 3.3 V until a device pulls it low. It never raises a pin to 5 V (A), which would be harmful. It does not stop static (B). It lets only a tiny current flow (C), so devices can pull the line down easily.

    **Concept Tested:** Pull Up Resistor

    **See:** [The Pull-Up Resistor](index.md#the-pull-up-resistor)

---

#### 8. Why is electrostatic discharge especially sneaky as a danger to a Raspberry Pi?

<div class="upper-alpha" markdown>
1. It only happens when the board is powered on and running
2. It always leaves a visible scorch mark that is hard to spot
3. A shock too small to feel can cause damage that shows up later
4. It can only damage the board if the discharge is above 5,000 volts
</div>

??? question "Show Answer"
    The correct answer is **C**. Electrostatic discharge is the sudden flow of built-up static charge between two objects. A shock you can feel is about 3,000 volts, but chip damage can happen at only 100 volts. The board may seem fine and then fail weeks later. This is called latent damage. ESD can strike a board whether it is on or off (A). It often leaves no mark (B). Option D is wrong, because 5,000 volts is roughly a visible spark.

    **Concept Tested:** Electrostatic Discharge

    **See:** [Static Electricity Will Destroy Your Board](index.md#static-electricity-will-destroy-your-board)

---

#### 9. A sensor leg is pushed into hole B7 of a breadboard. Which hole is electrically connected to it?

<div class="upper-alpha" markdown>
1. B8
2. F7
3. C8
4. D7
</div>

??? question "Show Answer"
    The correct answer is **D**. A breadboard's main area is divided into rows of five holes, and all five holes in a row are connected. Holes A7 through E7 form one group, so D7 connects to B7. Option A (B8) and option C (C8) are in row 8, which is a different row. Option B (F7) is in row 7, but F sits on the other side of the center channel, and rows do not connect across the channel.

    **Concept Tested:** Breadboard

    **See:** [Wires and Breadboards](index.md#wires-and-breadboards)

---

#### 10. A station will sit in a small weatherproof box on a pole, with a solar panel as its only power source. Which two features of the Raspberry Pi Zero 2 W matter most for this site?

<div class="upper-alpha" markdown>
1. Its small size and its very low power draw
2. Its low cost and its standard 40-pin connector
3. Its built-in Bluetooth and its micro-USB connector
4. Its ability to run a web server and its built-in Wi-Fi
</div>

??? question "Show Answer"
    The correct answer is **A**. The Raspberry Pi Zero 2 W is about 65 mm by 30 mm, so it fits in a small box. It also draws very little power, which matters enormously when a solar panel is the only power source. Options B, C, and D list real features, but none of them solve this site's two problems: limited space and limited power. Matching features to the job is how station builders choose hardware.

    **Concept Tested:** Raspberry Pi Zero 2 W

    **See:** [A Whole Computer, Smaller Than a Credit Card](index.md#a-whole-computer-smaller-than-a-credit-card)

---

!!! mascot-celebration "Wired and Ready!"
    ![Mecha celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Great job, station builders! You can now explain voltage, current, and ground, find your way around the GPIO header and a breadboard, and keep your board safe from static. Let's take a reading!
