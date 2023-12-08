// Footer.js
import React, { useState } from 'react';

const Footer = () => {
    const [showDeclaration, setShowDeclaration] = useState(false);

    const toggleDeclaration = () => {
        setShowDeclaration(!showDeclaration);
      };

    return (  <>
        <div onClick={toggleDeclaration} className="select-none cursor-zoom-in w-screen p-1 h-7 bg-zinc-800 bottom-0 absolute sm:absolute text-center text-white" style={{ fontSize: '0.8em' }}>
          <p>Made by Giuseppe Rubino for the benefit of all.</p>
        </div>
  
        {showDeclaration && (
          <div onClick={toggleDeclaration} className="w-screen p-10 flex items-center justify-center h-screen bg-zinc-800 absolute z-20 -top-0 text-center text-white">
            <div>
            <h1>Declaration for a Better World.</h1>

            <p>In our pursuit of a brighter future, we stand united for peace, science, a free world, and the unwavering respect for every individual. We believe in the power of cooperation, understanding, and the boundless potential of humanity to create positive change.</p>

            <h2>Peace:</h2>
            <p>We advocate for a world where conflicts are resolved through dialogue, compassion, and diplomacy. By fostering a culture of peace, we strive to build bridges that transcend borders, bringing people together in harmony.</p>

            <h2>Science:</h2>
            <p>Guided by the principles of inquiry, reason, and evidence, we champion the importance of science in advancing knowledge, solving global challenges, and improving the well-being of all. Embracing scientific progress is crucial for a sustainable and enlightened society.</p>

            <h2>Free World:</h2>
            <p>We champion the values of freedom, democracy, and human rights. In a free world, diversity is celebrated, individual liberties are protected, and justice prevails. We reject oppression in all its forms, advocating for societies that empower every person to flourish.</p>

            <h2>Respect for Humanity:</h2>
            <p>Every individual deserves dignity, respect, and equal opportunities. We commit ourselves to promoting inclusivity, understanding, and empathy. By honoring the inherent worth of each person, we contribute to a world where diversity is cherished and discrimination has no place.</p>

            <p>Together, let us work towards a world that embraces peace, celebrates the wonders of science, upholds freedom, and respects the fundamental rights of every human being. Our collective efforts can shape a future where compassion triumphs, knowledge prevails, and the beauty of our shared humanity flourishes.</p>
            </div>
        </div>
      )}
    </>
  );
};

export default Footer;