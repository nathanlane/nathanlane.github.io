# -*- encoding: utf-8 -*-
# stub: open_uri_redirections 0.2.1 ruby lib

Gem::Specification.new do |s|
  s.name = "open_uri_redirections".freeze
  s.version = "0.2.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Jaime Iniesta".freeze, "Gabriel Cebrian".freeze, "Felix C. Stegerman".freeze]
  s.date = "2014-11-26"
  s.description = "OpenURI patch to allow redirections between HTTP and HTTPS".freeze
  s.email = ["jaimeiniesta@gmail.com".freeze]
  s.homepage = "https://github.com/jaimeiniesta/open_uri_redirections".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.7.6".freeze
  s.summary = "OpenURI patch to allow redirections between HTTP and HTTPS".freeze

  s.installed_by_version = "2.7.6" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rspec>.freeze, ["~> 3.1.0"])
      s.add_development_dependency(%q<fakeweb>.freeze, ["~> 1.3.0"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.3.2"])
    else
      s.add_dependency(%q<rspec>.freeze, ["~> 3.1.0"])
      s.add_dependency(%q<fakeweb>.freeze, ["~> 1.3.0"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.3.2"])
    end
  else
    s.add_dependency(%q<rspec>.freeze, ["~> 3.1.0"])
    s.add_dependency(%q<fakeweb>.freeze, ["~> 1.3.0"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.3.2"])
  end
end
