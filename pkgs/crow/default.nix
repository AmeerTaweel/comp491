{
  stdenv,
  fetchFromGitHub,
  asio,
  zlib,
  openssl,
  cmake,
  python3,
  ...
}:
stdenv.mkDerivation {
  pname = "crow";
  version = "2024-03-17";
  src = fetchFromGitHub {
    owner = "CrowCpp";
    repo = "crow";
    rev = "d0f1991e385069080d2898f0c784dfe8ea2be4d4";
    sha256 = "sha256-sGNdW36e/zy1OLmlfJfYjAIyMw+a5HhlpEH3IjEMYOQ=";
  };

  nativeBuildInputs = [
    cmake
  ];

  buildInputs = [
    asio
    zlib
    openssl
    python3
  ];

  cmakeFlags = [
    "-DCROW_FEATURES=ssl;compression"
    "-DCROW_ENABLE_DEBUG=OFF"
  ];

  installPhase = ''
    mkdir -p $out/include

    cd ../scripts/
    ${python3}/bin/python3 merge_all.py ../include crow_all.h

    cp crow_all.h $out/include
  '';
}
