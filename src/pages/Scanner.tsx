import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ShoppingCart, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { getProductByBarcode } from '../data/products';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { toast } from '../components/ui/Toaster';

const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [scanning, setScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraList, setCameraList] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [torchOn, setTorchOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const html5QrCodeScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize scanner when component mounts
    if (scannerRef.current) {
      html5QrCodeScannerRef.current = new Html5Qrcode('scanner');
      
      // Get list of cameras
      Html5Qrcode.getCameras()
  .then(devices => {
    if (devices && devices.length) {
      setCameraList(devices.map(device => device.id));
      
      // Prefer back camera if available
      const backCamera = devices.find(device =>
        /back|rear|environment/i.test(device.label)
      );

      setSelectedCamera((backCamera || devices[0]).id);
    }
  })

        .catch(err => {
          setScanError('Error accessing camera: ' + err);
        });
    }
    
    // Clean up on unmount
    return () => {
      if (html5QrCodeScannerRef.current?.isScanning) {
        html5QrCodeScannerRef.current.stop()
          .catch(err => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  const startScanner = () => {
    if (!html5QrCodeScannerRef.current || !selectedCamera) return;
    
    setScanning(true);
    setScanError(null);
    setScannedProduct(null);
    
    const qrConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1,
      formatsToSupport: [
        Html5Qrcode.FORMAT_EAN_13,
        Html5Qrcode.FORMAT_EAN_8,
        Html5Qrcode.FORMAT_UPC_A,
        Html5Qrcode.FORMAT_UPC_E,
        Html5Qrcode.FORMAT_QR_CODE
      ]
    };
    
    html5QrCodeScannerRef.current.start(
      selectedCamera,
      qrConfig,
      handleScanSuccess,
      handleScanFailure
    )
    .catch(err => {
      setScanning(false);
      setScanError('Failed to start scanner: ' + err);
    });
  };

  const stopScanner = () => {
    if (html5QrCodeScannerRef.current && html5QrCodeScannerRef.current.isScanning) {
      html5QrCodeScannerRef.current.stop()
        .then(() => {
          setScanning(false);
        })
        .catch(err => {
          console.error('Error stopping scanner:', err);
        });
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    stopScanner();
    
    // Check if the decoded text matches a barcode
    const product = getProductByBarcode(decodedText);
    
    if (product) {
      setScannedProduct(product);
      toast.success(`Found: ${product.name}`);
    } else {
      setScanError('Product not found for barcode: ' + decodedText);
      toast.error('Product not found for this barcode');
    }
  };

  const handleScanFailure = (error: string) => {
    // We don't need to handle this error as it's raised frequently when no barcode is detected
    if (error.includes('No MultiFormat Readers were able to detect the code')) {
      return;
    }
    
    console.warn('Scan error:', error);
  };

  const handleAddToCart = () => {
    if (scannedProduct) {
      addToCart(scannedProduct, 1);
      toast.success(`${scannedProduct.name} added to cart`);
      closeProductModal();
    }
  };

  const handleViewProduct = () => {
    if (scannedProduct) {
      navigate(`/products/${scannedProduct.id}`);
    }
  };

  const closeProductModal = () => {
    setScannedProduct(null);
  };

  const toggleTorch = () => {
    if (html5QrCodeScannerRef.current) {
      const newTorchStatus = !torchOn;
      
      html5QrCodeScannerRef.current.applyVideoConstraints({
        advanced: [{ torch: newTorchStatus }]
      })
      .then(() => {
        setTorchOn(newTorchStatus);
      })
      .catch(error => {
        console.error('Torch not supported:', error);
        toast.error('Torch not supported by your device');
      });
    }
  };

  const adjustZoom = (increase: boolean) => {
    let newZoom = increase ? zoomLevel + 0.1 : zoomLevel - 0.1;
    newZoom = Math.max(1, Math.min(newZoom, 2)); // Limit zoom between 1x and 2x
    
    if (html5QrCodeScannerRef.current) {
      html5QrCodeScannerRef.current.applyVideoConstraints({
        advanced: [{ zoom: newZoom }]
      })
      .then(() => {
        setZoomLevel(newZoom);
      })
      .catch(error => {
        console.error('Zoom not supported:', error);
        toast.error('Zoom not supported by your device');
      });
    }
  };

  const switchCamera = (cameraId: string) => {
    if (html5QrCodeScannerRef.current && html5QrCodeScannerRef.current.isScanning) {
      html5QrCodeScannerRef.current.stop()
        .then(() => {
          setSelectedCamera(cameraId);
          // Restart with new camera after a short delay
          setTimeout(startScanner, 500);
        })
        .catch(err => {
          console.error('Error switching camera:', err);
        });
    } else {
      setSelectedCamera(cameraId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Barcode Scanner</h1>
            
            <div className="text-center mb-4">
              <p className="text-gray-600 mb-2">
                Point your camera at a product barcode to get product information
              </p>
            </div>
            
            {/* Camera Selection */}
            {cameraList.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Camera
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => switchCamera(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={scanning}
                >
                  {cameraList.map((cameraId, index) => (
                    <option key={cameraId} value={cameraId}>
                      Camera {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Camera View */}
            <div className="relative rounded-lg overflow-hidden bg-black mb-4 aspect-square">
              <div 
                id="scanner" 
                ref={scannerRef} 
                className="w-full h-full"
              />
              
              {!scanning && !scannedProduct && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-white text-center px-6">
                    Press the Start Scanner button to begin scanning
                  </p>
                </div>
              )}
              
              {/* Camera Controls */}
              {scanning && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <button
                    onClick={toggleTorch}
                    className={`p-3 rounded-full ${torchOn ? 'bg-accent-500' : 'bg-gray-800'} text-white`}
                    title={torchOn ? "Turn off torch" : "Turn on torch"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => adjustZoom(false)}
                    className="p-3 rounded-full bg-gray-800 text-white"
                    disabled={zoomLevel <= 1}
                    title="Zoom out"
                  >
                    <ZoomOut className="h-6 w-6" />
                  </button>
                  
                  <button
                    onClick={() => adjustZoom(true)}
                    className="p-3 rounded-full bg-gray-800 text-white"
                    disabled={zoomLevel >= 2}
                    title="Zoom in"
                  >
                    <ZoomIn className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Scanner Message */}
            {scanError && (
              <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-lg">
                <p>{scanError}</p>
              </div>
            )}
            
            {/* Scanner Controls */}
            <div className="flex justify-center">
              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Start Scanner
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Stop Scanner
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Scan Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">How to Scan</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Start Scanner" to activate your camera</li>
              <li>Point your camera at a product barcode</li>
              <li>Hold steady until the barcode is recognized</li>
              <li>View product details and add to cart if desired</li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Scanned Product Modal */}
      {scannedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className="relative">
              <img 
                src={scannedProduct.image} 
                alt={scannedProduct.name} 
                className="w-full h-48 object-cover"
              />
              <button
                onClick={closeProductModal}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{scannedProduct.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{scannedProduct.brand}</p>
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-gray-900">₹{scannedProduct.price}</span>
                  {scannedProduct.mrp && scannedProduct.price < scannedProduct.mrp && (
                    <span className="ml-2 text-sm text-gray-500 line-through">₹{scannedProduct.mrp}</span>
                  )}
                </div>
                <span className="text-sm">{scannedProduct.weight || scannedProduct.unit}</span>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{scannedProduct.description}</p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleViewProduct}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;