import { motion } from "framer-motion";
import CrowLogo from "@/assets/svg/CrowLogo";

export default function DonationSection() {
  const donationTiers = [
    { amount: 5, name: "Petisco" },
    { amount: 15, name: "Refeição" },
    { amount: 30, name: "Banquete" }
  ];

  return (
    <section className="py-10 bg-gradient-to-r from-[#0A0A12] to-[#2D0A3A] constellation-bg">
      <div className="container mx-auto px-4 text-center">
        <motion.h3 
          className="font-komoda text-2xl md:text-3xl mb-2 frosted-text"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ALIMENTE O CORVO
        </motion.h3>
        <motion.p 
          className="text-gray-300 max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Ajude a manter o Floky caçando de olhos bem abertos. Sua contribuição mantém nossos servidores ativos e o corvo bem alimentado.
        </motion.p>
        
        <motion.div 
          className="max-w-md mx-auto border border-[#00A3FF] border-opacity-30 shadow-lg bg-[#151515] p-6 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            <CrowLogo width={60} height={60} secondaryColor="#8A2BE2" eyeColor="#00A3FF" />
          </div>
          
          {/* PIX Donation */}
          <div className="mb-4">
            <motion.a
              href="https://livepix.gg/apenasfloky"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#00A3FF] text-[#0A0A12] font-bold rounded-lg hover:brightness-110 transition flex items-center justify-center"
              whileHover={{ scale: 1.02, boxShadow: "0 0 15px #00A3FF" }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-bolt mr-2"></i>
              DOAR VIA PIX
            </motion.a>
            <p className="text-xs text-gray-400 mt-2">
              PIX QR Code através do LivePix será aberto
            </p>
          </div>
          
          {/* Donation Tiers */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {donationTiers.map((tier, index) => (
              <motion.a
                key={index}
                href={`https://livepix.gg/apenasfloky?amount=${tier.amount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#151515] rounded hover:bg-[#8A2BE2] hover:bg-opacity-20 transition"
                whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(138, 43, 226, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="block font-bold text-[#00A3FF]">R${tier.amount}</span>
                <span className="text-xs text-gray-400">{tier.name}</span>
              </motion.a>
            ))}
          </div>
          
          <p className="text-sm text-gray-300">
            Segue lá: <span className="text-[#8A2BE2]">@ApenasFloky</span> em todas as redes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
