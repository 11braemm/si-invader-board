import React, { useEffect, useState } from 'react';
import './App.css';
import _, { sampleSize } from 'lodash';

function App() {
  const [fear, setFear] = useState(0);
  const [blight, setBlight] = useState(5);
  const [setup, setSetup] = useState(false);
  const [invaderDeck, setInvaderDeck] = useState<string[]>(["J"]);
  const [inputValue, setInputValue] = useState('1,1,1,2,2,2,2,3,3,3,3,3');
  const [fearInputValue, setFearInputValue] = useState('2,4,3');
  const [discard, setDiscard] = useState<string[]>([]);
  const [blightedIsland, setBlightedIsland] = useState(false);
  const [fearDeck, setFearDeck] = useState<{ [key: number]: number }>({1: 0, 2: 0, 3: 0});
  const [terrorLevel, setTerrorLevel] = useState<number>(1);


  useEffect(() => {
    if (fear === 8 && setup) {
      setFear(0);
      setFearDeck({
        ...fearDeck,
        [terrorLevel]: fearDeck[terrorLevel] - 1,
      })
      alert("You've gained a fear card!")
    }
  }
  , [fear]);

  useEffect(() => {
    if (fearDeck[terrorLevel] === 0 && setup) {
      alert(`Terror Level ${terrorLevel + 1} Unlocked!`)
      setTerrorLevel(terrorLevel + 1);
    }
  }
  , [fearDeck]);

  useEffect(() => {
    if (terrorLevel === 4 && setup) {
      alert(`You Win!`)
    }
  }
  , [terrorLevel]);


  useEffect(() => {
    if (blight === 0 && blightedIsland && setup) {
      alert("You lose :(")
    }
  }
  , [blight]);

  
  useEffect(() => {
    if (blight === 0 && !blightedIsland && setup) {
      alert("Blighted Island!")
      setBlightedIsland(true);
      setBlight(10);
    }
  }
  , [blight]);


  const [invaderCards, setInvaderCards] = useState<{ [key: string]: string[] }>({
    1: ["W", "J", "S", "M"],
    2: ["W (E)", "J (E)", "S (E)", "M (E)", "C"],
    3: ["W+J", "J+S", "S+W", "M+W", "M+S", "M+J"],
  });

  // Handles input change and updates the value
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  const handleFearInputChange = (e: any) => {
    setFearInputValue(e.target.value);
  };

  useEffect(() => {
    if (invaderDeck.length === 0 && setup) {
      alert("You lose :(")
    }
  }
  , [invaderDeck]);

  const advanceInvaderCards = () => {
    // Take the first card from selectedDeck and add it to the discard list
    const [firstCard, ...remainingCards] = invaderDeck;

    // Update selectedDeck (shift forward) and discard
    setInvaderDeck(remainingCards);
    setDiscard((prevDiscard: string[]) => [firstCard, ...prevDiscard]); 
  };

  // Function to move cards backward by taking the last card from the discard list
  const retreatInvaderCards = () => {
    if (discard.length === 0) return; // Do nothing if discard is empty

    // Take the last card from discard and add it to the start of selectedDeck
    const [lastCard, ...remainingDiscard] = discard;

    // Update selectedDeck and discard
    setInvaderDeck((prevSelectedDeck: string[]) => [lastCard, ...prevSelectedDeck]); // Add the card to the start of selectedDeck
    setDiscard(remainingDiscard); // Remove the card from discard
  };
  
  const handleSetup = () => {
    try {
      const deck = inputValue.split(",")
      const stageCounts = {
        1: deck.filter((card) => card === "1").length,
        2: deck.filter((card) => card === "2").length,
        3: deck.filter((card) => card === "3").length,
      }
      const stageCards = {
        1: _.sampleSize(invaderCards[1], stageCounts[1]),
        2: _.sampleSize(invaderCards[2], stageCounts[2]),
        3: _.sampleSize(invaderCards[3], stageCounts[3]),
      }

      const cardCounters = { 1: -1, 2: -1, 3: -1 };
      const selectedDeck: string[] = deck.map((cardType) => {
        if (cardType === "1") {
          cardCounters[1]++;
          return stageCards[1][cardCounters[1]];
        }
        if (cardType === "2") {
          cardCounters[2]++;
          return stageCards[2][cardCounters[2]];
        }
        if (cardType === "3") {
          cardCounters[3]++;
          return stageCards[3][cardCounters[3]];
        }
        throw new Error("Invalid card type"); 
      });
      selectedDeck.unshift("");
      selectedDeck.unshift("");

      const fearDeck = fearInputValue.split(",").map((fearCard) => parseInt(fearCard));
      setFearDeck({1: fearDeck[0], 2: fearDeck[1], 3: fearDeck[2]});

      setInvaderDeck(selectedDeck);
      setSetup(true);
    } catch (error) {
      alert(
        error
      );
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        {setup ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30, width: 300 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
              <div>
                <div>Fear</div>
                <div style={{ fontSize: 13 }}>
                  <div>Terror Level {terrorLevel}</div>
                  <div>{fearDeck[terrorLevel]} cards remaining</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => setFear(fear - 1)}>-</button>
                <div>{fear}</div>
                <button onClick={() => setFear(fear + 1)}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
              <div>
                <div>Blight</div>
                <div style={{ fontSize: 13 }}>{blightedIsland ? "Blighted Island" : "Healthy Island"}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => setBlight(blight - 1)}>-</button>
                <div>{blight}</div>
                <button onClick={() => setBlight(blight + 1)}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
              <div>Invader Deck</div>
              <div style={{ fontSize: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                  <div>Ravage</div>
                  <div>Build</div>
                  <div>Explore</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                  <div>{invaderDeck[0]}</div>
                  <div>{invaderDeck[1]}</div>
                  <div>{invaderDeck[2]}</div>
                </div>
                <button onClick={() => advanceInvaderCards()}>Advance Invader Cards</button>
                <button onClick={() => retreatInvaderCards()}>Retreat Invader Cards</button>
                <button onClick={() => setSetup(false)}>Show Discard</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div>
                <div>Enter invader deck setup</div>
                <input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter comma-separated values"
                  style={{ width: 200 }}
                />
              </div>
              <div>
                <div>Enter fear setup</div>
                <input
                  value={fearInputValue}
                  onChange={handleFearInputChange}
                  placeholder="Enter comma-separated values"
                  style={{ width: 200 }}
                />
              </div>
            </div>
            <button onClick={handleSetup}>Submit</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
