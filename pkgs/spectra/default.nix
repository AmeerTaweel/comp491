{
  fetchFromGitHub,
  buildPythonPackage,
  colormath,
  ...
}:
buildPythonPackage {
  pname = "spectra";
  version = "2021-08-11";
  src = fetchFromGitHub {
    owner = "jsvine";
    repo = "spectra";
    rev = "644331717f0320f3dbe6a83efafa729d04303146";
    sha256 = "sha256-rMupzvzjVbZ3BF22Jh+5ZVrzGfZLV54oUlyYqP5Lmmk=";
  };

  doCheck = false;

  propagatedBuildInputs = [colormath];
}
