// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

package kes

import (
	"time"

	"github.com/minio/kes"
)

type Identity = kes.Identity

type TLSProxyHeader struct {
	ClientCert string `yaml:"cert,omitempty"`
}

type TLSProxy struct {
	Identities *[]Identity     `yaml:"identities,omitempty" json:"identities,omitempty"`
	Header     *TLSProxyHeader `yaml:"header,omitempty" json:"header,omitempty"`
}

type TLS struct {
	KeyPath  string    `yaml:"key,omitempty" json:"key,omitempty"`
	CertPath string    `yaml:"cert,omitempty" json:"cert,omitempty"`
	Proxy    *TLSProxy `yaml:"proxy,omitempty" json:"proxy,omitempty"`
}

type Policy struct {
	Paths      []string   `yaml:"paths,omitempty" json:"paths,omitempty"`
	Identities []Identity `yaml:"identities,omitempty" json:"identities,omitempty"`
}

type Expiry struct {
	Any    time.Duration `yaml:"any,omitempty" json:"any,omitempty"`
	Unused time.Duration `yaml:"unused,omitempty" json:"unused,omitempty"`
}

type Cache struct {
	Expiry *Expiry `yaml:"expiry,omitempty" json:"expiry,omitempty"`
}

type Log struct {
	Error string `yaml:"error,omitempty" json:"error,omitempty"`
	Audit string `yaml:"audit,omitempty" json:"audit,omitempty"`
}

type Fs struct {
	Path string `yaml:"path,omitempty" json:"path,omitempty"`
}

type AppRole struct {
	EnginePath string        `yaml:"engine,omitempty" json:"engine,omitempty"`
	ID         string        `yaml:"id,omitempty" json:"id,omitempty"`
	Secret     string        `yaml:"secret,omitempty" json:"secret,omitempty"`
	Retry      time.Duration `yaml:"retry,omitempty" json:"retry,omitempty"`
}

type VaultTLS struct {
	KeyPath  string `yaml:"key,omitempty" json:"key,omitempty"`
	CertPath string `yaml:"cert,omitempty" json:"cert,omitempty"`
	CAPath   string `yaml:"ca,omitempty" json:"ca,omitempty"`
}

type VaultStatus struct {
	Ping time.Duration `yaml:"ping,omitempty" json:"ping,omitempty"`
}

type Vault struct {
	Endpoint   string       `yaml:"endpoint,omitempty" json:"endpoint,omitempty"`
	EnginePath string       `yaml:"engine,omitempty" json:"engine,omitempty"`
	Namespace  string       `yaml:"namespace,omitempty" json:"namespace,omitempty"`
	Prefix     string       `yaml:"prefix,omitempty" json:"prefix,omitempty"`
	AppRole    *AppRole     `yaml:"approle,omitempty" json:"approle,omitempty"`
	TLS        *VaultTLS    `yaml:"tls,omitempty" json:"tls,omitempty"`
	Status     *VaultStatus `yaml:"status,omitempty" json:"status,omitempty"`
}

type AwsSecretManagerLogin struct {
	AccessKey    string `yaml:"accesskey" json:"accesskey"`
	SecretKey    string `yaml:"secretkey" json:"secretkey"`
	SessionToken string `yaml:"token" json:"token"`
}

type AwsSecretManager struct {
	Endpoint string                 `yaml:"endpoint,omitempty" json:"endpoint,omitempty"`
	Region   string                 `yaml:"region,omitempty" json:"region,omitempty"`
	KmsKey   string                 `yaml:"kmskey,omitempty" json:"kmskey,omitempty"`
	Login    *AwsSecretManagerLogin `yaml:"credentials,omitempty" json:"credentials,omitempty"`
}

type Aws struct {
	SecretsManager *AwsSecretManager `yaml:"secretsmanager,omitempty" json:"secretsmanager,omitempty"`
}

type GemaltoCredentials struct {
	Token  string        `yaml:"token,omitempty" json:"token,omitempty"`
	Domain string        `yaml:"domain,omitempty" json:"domain,omitempty"`
	Retry  time.Duration `yaml:"retry,omitempty" json:"retry,omitempty"`
}

type GemaltoTLS struct {
	CAPath string `yaml:"ca,omitempty"`
}

type GemaltoKeySecure struct {
	Endpoint    string              `yaml:"endpoint,omitempty" json:"endpoint,omitempty"`
	Credentials *GemaltoCredentials `yaml:"credentials,omitempty" json:"credentials,omitempty"`
	TLS         *GemaltoTLS         `yaml:"tls,omitempty" json:"tls,omitempty"`
}

type Gemalto struct {
	KeySecure *GemaltoKeySecure `yaml:"keysecure,omitempty" json:"keysecure,omitempty"`
}

type GcpCredentials struct {
	ClientEmail  string `yaml:"client_email" json:"client_email"`
	ClientID     string `yaml:"client_id" json:"client_id"`
	PrivateKeyID string `yaml:"private_key_id" json:"private_key_id"`
	PrivateKey   string `yaml:"private_key" json:"private_key"`
}

type GcpSecretManager struct {
	ProjectID   string          `yaml:"project_id" json:"project_id"`
	Endpoint    string          `yaml:"endpoint,omitempty" json:"endpoint,omitempty"`
	Credentials *GcpCredentials `yaml:"credentials,omitempty" json:"credentials,omitempty"`
}

type Gcp struct {
	SecretManager *GcpSecretManager `yaml:"secretmanager,omitempty" json:"secretmanager,omitempty"`
}

type AzureCredentials struct {
	TenantID     string `yaml:"tenant_id" json:"tenant_id"`
	ClientID     string `yaml:"client_id" json:"client_id"`
	ClientSecret string `yaml:"client_secret" json:"client_secret"`
}

type AzureKeyVault struct {
	Endpoint    string            `yaml:"endpoint,omitempty" json:"endpoint,omitempty"`
	Credentials *AzureCredentials `yaml:"credentials,omitempty" json:"credentials,omitempty"`
}

type Azure struct {
	KeyVault *AzureKeyVault `yaml:"keyvault,omitempty" json:"keyvault,omitempty"`
}

type Keys struct {
	Fs      *Fs      `yaml:"fs,omitempty" json:"fs,omitempty"`
	Vault   *Vault   `yaml:"vault,omitempty" json:"vault,omitempty"`
	Aws     *Aws     `yaml:"aws,omitempty" json:"aws,omitempty"`
	Gemalto *Gemalto `yaml:"gemalto,omitempty" json:"gemalto,omitempty"`
	Gcp     *Gcp     `yaml:"gcp,omitempty" json:"gcp,omitempty"`
	Azure   *Azure   `yaml:"azure,omitempty" json:"azure,omitempty"`
}

type ServerConfig struct {
	Addr     string            `yaml:"address,omitempty" json:"address,omitempty"`
	Root     Identity          `yaml:"root,omitempty" json:"root,omitempty"`
	TLS      TLS               `yaml:"tls,omitempty" json:"tls,omitempty"`
	Policies map[string]Policy `yaml:"policy,omitempty" json:"policy,omitempty"`
	Cache    Cache             `yaml:"cache,omitempty" json:"cache,omitempty"`
	Log      Log               `yaml:"log,omitempty" json:"log,omitempty"`
	Keys     Keys              `yaml:"keys,omitempty" json:"keys,omitempty"`
}
