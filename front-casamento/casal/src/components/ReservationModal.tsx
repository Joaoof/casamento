import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User, Mail, Heart, Gift, Check, AlertCircle, X } from 'lucide-react';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reservedBy: string) => void;
    giftName: string;
    giftPrice?: number;
    giftDescription?: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    giftName,
    giftPrice,
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

    const nameInputRef = useRef<HTMLInputElement>(null);

    const validateForm = () => {
        const newErrors: { name?: string; email?: string } = {};
        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }
        if (!email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'E-mail inválido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1200));
            const reservedBy = `${name.trim()} <${email.trim()}>`;

            setIsSuccess(true);

            // Wait for success animation then close
            setTimeout(() => {
                onConfirm(reservedBy);
                resetForm();
                onClose();
            }, 1000);

        } catch (error) {
            console.error('Error submitting reservation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setErrors({});
        setIsSubmitting(false);
        setIsSuccess(false);
    };

    const handleClose = () => {
        if (!isSubmitting && !isSuccess) {
            resetForm();
            onClose();
        }
    };

    // Focus management
    useEffect(() => {
        if (isOpen) {
            resetForm();
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#D8B56A]/30 p-0 max-h-[85vh] flex flex-col">

                {/* Success Overlay */}
                {isSuccess && (
                    <div className="absolute inset-0 bg-[#A3B8CC]/95 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                        <div className="text-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce border-2 border-white/40">
                                <Check size={32} />
                            </div>
                            <h3 className="text-xl font-medium mb-2 tracking-wide">Reserva Confirmada!</h3>
                            <p className="text-white/80 font-light">Preparando tudo...</p>
                        </div>
                    </div>
                )}

                {/* Header - Azul Serenity com detalhe Marrom */}
                <div className="bg-[#A3B8CC] border-b-[3px] border-[#8B4513] px-6 py-8 relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
                        disabled={isSubmitting || isSuccess}
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4 border border-white/30 backdrop-blur-sm">
                            <Heart size={26} className="text-white" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-light text-white mb-1 tracking-wide">
                                Reservar Presente
                            </DialogTitle>
                            <DialogDescription className="text-white/90 text-sm font-light">
                                Insira seus dados para confirmar o carinho
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-white">
                    {/* Gift Info - Fundo Bege */}
                    <div className="px-6 py-5 bg-[#F5F5DC]/40 border-b border-[#D8B56A]/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-[#D8B56A]/40 shadow-sm">
                                <Gift size={22} className="text-[#8B4513]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-[#000000] text-base leading-tight">{giftName}</h3>
                                {giftPrice && (
                                    <p className="text-[#8B4513] font-semibold text-lg mt-1">
                                        R$ {giftPrice.toFixed(2).replace('.', ',')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#8B4513] mb-2">
                                Nome Completo *
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D8B56A]" />
                                <Input
                                    ref={nameInputRef}
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                                    }}
                                    placeholder="Seu nome completo"
                                    className={`pl-10 h-12 rounded-xl border transition-all duration-300 bg-white text-[#000000] ${errors.name
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-[#D8B56A]/50 focus:border-[#A3B8CC] focus:ring-1 focus:ring-[#A3B8CC] hover:border-[#D8B56A]'
                                        }`}
                                    disabled={isSubmitting}
                                    autoComplete="name"
                                />
                                {errors.name && (
                                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-medium">
                                        <AlertCircle size={14} />
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#8B4513] mb-2">
                                E-mail *
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D8B56A]" />
                                <Input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                                    }}
                                    placeholder="seu@email.com"
                                    type="email"
                                    className={`pl-10 h-12 rounded-xl border transition-all duration-300 bg-white text-[#000000] ${errors.email
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                        : 'border-[#D8B56A]/50 focus:border-[#A3B8CC] focus:ring-1 focus:ring-[#A3B8CC] hover:border-[#D8B56A]'
                                        }`}
                                    disabled={isSubmitting}
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <div className="flex items-center gap-2 mt-2 text-red-500 text-sm font-medium">
                                        <AlertCircle size={14} />
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Fixed Footer */}
                <div className="border-t border-[#D8B56A]/20 bg-[#F5F5DC]/10 px-6 py-5">
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleClose}
                            className="flex-1 h-12 rounded-xl font-medium border-[#D8B56A]/50 text-[#8B4513] hover:bg-[#F5F5DC] hover:text-[#8B4513] transition-colors"
                            disabled={isSubmitting || isSuccess}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            className="flex-1 h-12 bg-[#A3B8CC] hover:bg-[#8FA9C0] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border-none"
                            disabled={isSubmitting || isSuccess}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Confirmando...
                                </>
                            ) : (
                                <>
                                    <Check size={18} />
                                    Confirmar
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center justify-center gap-2 text-xs text-[#8B4513]/60 mt-4 font-light">
                        <div className="w-1.5 h-1.5 bg-[#A3B8CC] rounded-full"></div>
                        <span>Ambiente seguro. Seus dados estão protegidos.</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReservationModal;